import * as mock from "./mockData";

export const useUser = () => ({
  data: mock.MOCK_USER,
  isLoading: false,
  error: null as unknown | null,
});

export const useChildProfile = () => ({
  data: mock.MOCK_CHILD_PROFILE,
  isLoading: false,
  error: null as unknown | null,
});

export const useStats = () => ({
  data: mock.MOCK_STATS,
  isLoading: false,
  error: null as unknown | null,
});

export const useTales = () => ({
  data: mock.MOCK_TALES,
  isLoading: false,
  error: null as unknown | null,
});

export const useRecommendations = () => ({
  data: mock.MOCK_RECOMMENDATIONS,
  isLoading: false,
  error: null as unknown | null,
});

export const useReferral = () => ({
  data: mock.MOCK_REFERRAL,
  isLoading: false,
  error: null as unknown | null,
});

