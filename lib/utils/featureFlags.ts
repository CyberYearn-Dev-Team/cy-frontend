import { getFeatureFlags } from "@/lib/services/featureFlagService";

export const isFeatureEnabled = async (featureName: string): Promise<boolean> => {
  try {
    const flags = await getFeatureFlags();
    const feature = flags.find(flag => 
      flag.name.toLowerCase() === featureName.toLowerCase()
    );
    return feature?.enabled || false;
  } catch (error) {
    console.error(`Error checking feature flag ${featureName}:`, error);
    return false; // Default to disabled if there's an error
  }
};
