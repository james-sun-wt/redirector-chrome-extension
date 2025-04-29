chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'updateRules') {
    const rules = message.rules;
    
    // Remove existing rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds,
      addRules: rules
    });
  }
});

// Load initial rules from storage
chrome.storage.sync.get(['redirectRules'], async function(result) {
  if (result.redirectRules) {
    const rules = result.redirectRules.map((rule, index) => ({
      id: index + 1,
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
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [],
      addRules: rules
    });
  }
});