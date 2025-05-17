// Mock logger first
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock prisma before importing it
jest.mock('@/lib/prisma', () => {
  const mockCreate = jest.fn().mockImplementation(async (args: { data: any }) => ({
    id: 1,
    ...args.data,
    timestamp: new Date(),
  }));

  const mockFindMany = jest.fn().mockImplementation(async () => []);

  const mockEventCreate = jest.fn().mockImplementation(async (args: { data: any }) => ({
    id: 1,
    ...args.data,
    timestamp: new Date(),
  }));

  return {
    prisma: {
      analyticsEvent: {
        create: mockCreate as jest.Mock,
        findMany: mockFindMany as jest.Mock,
      },
      event: {
        create: mockEventCreate as jest.Mock,
      },
    },
  };
});

// Mock date-fns before importing
const mockDateFns = {
  subDays: jest.fn((date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }),
  startOfDay: jest.fn((date: Date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }),
  endOfDay: jest.fn((date: Date) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }),
};

jest.mock('date-fns', () => ({
  __esModule: true,
  subDays: mockDateFns.subDays,
  startOfDay: mockDateFns.startOfDay,
  endOfDay: mockDateFns.endOfDay,
}));

// Now import dependencies
import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { MetricData, MetricsOptions, FunnelStep, AnalyticsService } from '../analytics';
import { prisma } from '@/lib/prisma';

// Get mocked instances after all mocks are set up
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockError = jest.mocked(logger.error);

interface AnalyticsEvent {
  id: number;
  userId: string;
  metricName: string;
  value: number;
  dimensions: Record<string, any>;
  metadata: Record<string, any>;
  timestamp: Date;
}

interface Event {
  id: number;
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
}

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    analyticsService = new AnalyticsService();
  });

  describe('Metric Tracking', () => {
    it('should track metrics successfully', async () => {
      const metric = {
        userId: 'test-user',
        metricName: 'pageViews',
        value: 1,
        dimensions: {
          page: '/home'
        },
        metadata: {
          browser: 'chrome'
        }
      };

      const mockEvent: AnalyticsEvent = {
        id: 1,
        userId: metric.userId,
        metricName: metric.metricName,
        value: metric.value,
        dimensions: metric.dimensions,
        metadata: metric.metadata,
        timestamp: new Date()
      };

      (mockPrisma.analyticsEvent.create as jest.Mock).mockResolvedValueOnce(mockEvent);

      await analyticsService.trackMetric(
        metric.userId,
        metric.metricName,
        metric.value,
        metric.dimensions,
        metric.metadata
      );

      expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: metric.userId,
          metricName: metric.metricName,
          value: metric.value,
          dimensions: metric.dimensions,
          metadata: metric.metadata,
          timestamp: expect.any(Date)
        })
      });
    });
  });

  describe('Metric Querying', () => {
    const mockMetrics: AnalyticsEvent[] = [
      {
        id: 1,
        userId: 'test-user',
        metricName: 'pageViews',
        value: 100,
        dimensions: { page: '/home' },
        metadata: {},
        timestamp: new Date('2023-01-01')
      },
      {
        id: 2,
        userId: 'test-user',
        metricName: 'clicks',
        value: 50,
        dimensions: { button: 'submit' },
        metadata: {},
        timestamp: new Date('2023-01-02')
      }
    ];

    it('should get metrics with options', async () => {
      const options: MetricsOptions = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-02'),
        metrics: ['pageViews', 'clicks']
      };

      (mockPrisma.analyticsEvent.findMany as jest.Mock).mockResolvedValueOnce(mockMetrics);

      const result = await analyticsService.getMetrics('test-user', options);

      expect(result).toHaveLength(2);
      expect(mockPrisma.analyticsEvent.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'test-user',
          timestamp: {
            gte: options.startDate,
            lte: options.endDate
          },
          metricName: { in: options.metrics }
        },
        orderBy: {
          timestamp: 'asc'
        }
      });
    });

    it('should get real-time metrics', async () => {
      const mockDate = new Date('2023-01-01');
      mockDateFns.subDays.mockReturnValue(mockDate);

      (mockPrisma.analyticsEvent.findMany as jest.Mock).mockResolvedValueOnce(mockMetrics);

      const result = await analyticsService.getRealTimeMetrics('test-user', ['pageViews']);

      expect(result).toHaveLength(2);
      expect(mockPrisma.analyticsEvent.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'test-user',
          timestamp: {
            gte: mockDate
          },
          metricName: { in: ['pageViews'] }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });
    });
  });

  describe('Funnel Analysis', () => {
    it('should calculate funnel metrics', async () => {
      const mockEvents: AnalyticsEvent[] = [
        {
          id: 1,
          userId: 'test-user',
          metricName: 'step1',
          value: 1,
          dimensions: {},
          metadata: {},
          timestamp: new Date('2023-01-01')
        },
        {
          id: 2,
          userId: 'test-user',
          metricName: 'step2',
          value: 1,
          dimensions: {},
          metadata: {},
          timestamp: new Date('2023-01-01')
        }
      ];

      const mockStartDate = new Date('2023-01-01T00:00:00.000Z');
      const mockEndDate = new Date('2023-01-01T23:59:59.999Z');

      mockDateFns.startOfDay.mockReturnValue(mockStartDate);
      mockDateFns.endOfDay.mockReturnValue(mockEndDate);

      (mockPrisma.analyticsEvent.findMany as jest.Mock).mockResolvedValueOnce(mockEvents);

      const result = await analyticsService.getFunnelMetrics(
        'test-user',
        ['step1', 'step2'],
        new Date('2023-01-01'),
        new Date('2023-01-02')
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        fromStep: 'step1',
        toStep: 'step2',
        conversionRate: 100,
        fromCount: 1,
        toCount: 1
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors during metric tracking', async () => {
      const dbError = new Error('Database error');
      (mockPrisma.analyticsEvent.create as jest.Mock).mockRejectedValueOnce(dbError);

      await expect(analyticsService.trackMetric('user', 'metric', 1))
        .rejects.toThrow(dbError);

      expect(mockError).toHaveBeenCalledWith(
        'Error tracking metric:',
        dbError
      );
    });

    it('should handle database errors during metric querying', async () => {
      const dbError = new Error('Query error');
      (mockPrisma.analyticsEvent.findMany as jest.Mock).mockRejectedValueOnce(dbError);

      await expect(analyticsService.getMetrics('user'))
        .rejects.toThrow(dbError);
    });
  });

  describe('Custom Events', () => {
    it('should track custom events', async () => {
      const customEvent = {
        name: 'custom_event',
        properties: {
          key: 'value'
        }
      };

      const mockEvent = {
        id: 1,
        name: customEvent.name,
        properties: customEvent.properties,
        timestamp: new Date()
      };

      (mockPrisma.event.create as jest.Mock).mockResolvedValueOnce(mockEvent);

      await analyticsService.trackEvent(customEvent);

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: customEvent.name,
          properties: customEvent.properties,
          timestamp: expect.any(Date)
        })
      });
    });
  });
});
