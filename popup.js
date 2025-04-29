let rules = [];

// Load existing rules
chrome.storage.sync.get(['redirectRules'], function(result) {
  rules = result.redirectRules || [];
  renderRules();
});

function renderRules() {
  const container = document.getElementById('rules-container');
  container.innerHTML = '';
  
  rules.forEach((rule, index) => {
    const ruleDiv = document.createElement('div');
    ruleDiv.className = 'rule';
    
    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.value = rule.from;
    fromInput.placeholder = 'From domain';
    fromInput.addEventListener('change', (e) => {
      rules[index].from = e.target.value;
      saveRules();
    });

    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.value = rule.to;
    toInput.placeholder = 'To domain';
    toInput.addEventListener('change', (e) => {
      rules[index].to = e.target.value;
      saveRules();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      rules.splice(index, 1);
      saveRules();
      renderRules();
    };

    ruleDiv.appendChild(fromInput);
    ruleDiv.appendChild(toInput);
    ruleDiv.appendChild(deleteBtn);
    container.appendChild(ruleDiv);
  });
}

document.getElementById('add-rule').addEventListener('click', () => {
  rules.push({ from: '', to: '' });
  renderRules();
});

function saveRules() {
  chrome.storage.sync.set({ redirectRules: rules }, function() {
    updateDynamicRules();
  });
}

function updateDynamicRules() {
  const dynamicRules = rules.map((rule, index) => ({
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

  chrome.runtime.sendMessage({ 
    type: 'updateRules', 
    rules: dynamicRules 
  });
}