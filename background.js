// Keep track of current rule IDs
let currentRuleIds = new Set();

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'updateRules') {
    const rules = message.rules;

    try {
      // Remove existing rules
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      const existingRuleIds = existingRules.map(rule => rule.id);

      // Clear existing rules
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds
      });

      // Reset current rule IDs
      currentRuleIds.clear();

      // Add new rules with unique IDs
      const newRules = rules.map((rule) => {
        // Find next available ID
        let newId = 1;
        while (currentRuleIds.has(newId)) {
          newId++;
        }
        currentRuleIds.add(newId);

        return {
          ...rule,
          id: newId
        };
      });

      // Add new rules
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: newRules
      });
    } catch (error) {
      console.error('Error updating rules:', error);
    }
  }
});

// Load initial rules from storage
chrome.storage.sync.get(['redirectRules'], async function(result) {
  if (result.redirectRules) {
    try {
      // Clear any existing rules first
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      const existingRuleIds = existingRules.map(rule => rule.id);

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds
      });

      // Reset current rule IDs
      currentRuleIds.clear();

      // Create rules with unique IDs
      const rules = result.redirectRules.map((rule) => {
        // Find next available ID
        let newId = 1;
        while (currentRuleIds.has(newId)) {
          newId++;
        }
        currentRuleIds.add(newId);

        return {
          id: newId,
          priority: 1,
          action: {
            type: "redirect",
            redirect: {
              regexSubstitution: `https://${rule.to}\\1`
            }
          },
          condition: {
            regexFilter: `^https://${rule.from}(/.*)?`,
            resourceTypes: ["main_frame"]
          }
        };
      });

      // Add new rules
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      });
    } catch (error) {
      console.error('Error loading initial rules:', error);
    }
  }
});