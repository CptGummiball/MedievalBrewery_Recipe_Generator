let items = [];
let effects = [];

fetch('/assets/items.json')
    .then(response => response.json())
    .then(data => {
        items = Object.entries(data).map(([id, name]) => ({
            id: id,
            name: name,
            icon: `${id.toLowerCase()}.png`
        }));
        populateDropdowns();
    });

fetch('/assets/effects.json')
    .then(response => response.json())
    .then(data => {
        effects = Object.entries(data).map(([id, name]) => ({
            id: id,
            name: name
        }));
        populateDropdowns();
    });

function populateDropdowns() {
    const ingredientSelect = document.getElementById('ingredientSelect');
    const effectSelect = document.getElementById('effectSelect');

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.innerHTML = `<img src='/assets/items/${item.icon}' alt='${item.name}'> ${item.name}`;
        ingredientSelect.appendChild(option);
    });

    effects.forEach(effect => {
        const option = document.createElement('option');
        option.value = effect.id;
        option.textContent = effect.name;
        effectSelect.appendChild(option);
    });
}

document.getElementById('addIngredientBtn').addEventListener('click', function() {
    const ingredient = document.getElementById('ingredientSelect').value;
    const amount = document.getElementById('ingredientAmount').value;

    if (ingredient && amount) {
        const ingredientList = document.getElementById('ingredientList');
        const item = items.find(i => i.id === ingredient);
        const li = document.createElement('li');
        li.innerHTML = `<img src='/assets/items/${item.icon}' alt='${item.name}'> ${item.name}, ${amount} <button onclick="removeListItem(this)">Remove</button>`;
        ingredientList.appendChild(li);
    }
});

document.getElementById('addEffectBtn').addEventListener('click', function() {
    const effect = document.getElementById('effectSelect').value;
    const duration = document.getElementById('effectDuration').value;
    const level = document.getElementById('effectLevel').value;

    if (effect && duration && level) {
        const effectList = document.getElementById('effectList');
        const eff = effects.find(e => e.id === effect);
        const li = document.createElement('li');
        li.innerHTML = `${eff.name}, Duration: ${duration}, Level: ${level} <button onclick="removeListItem(this)">Remove</button>`;
        effectList.appendChild(li);
    }
});

function removeListItem(button) {
    const li = button.parentElement;
    li.remove();
}

function generateYAML() {
    const recipeName = document.getElementById('recipeName').value.trim();
    const description = document.getElementById('description').value.trim();
    const potionColor = document.getElementById('potionColor').value;
    const chatColor = document.getElementById('chatColor').value;
    const customModelData = document.getElementById('customModelData').value || 0;
    const seconds = document.getElementById('seconds').value.trim();
    const uses = document.getElementById('uses').value.trim();

    const ingredientItems = Array.from(document.getElementById('ingredientList').children);
    const ingredients = ingredientItems.map(item => item.textContent.replace('Remove', '').trim());

    const effectItems = Array.from(document.getElementById('effectList').children);
    const effects = effectItems.map(item => item.textContent.replace('Remove', '').trim());

    if (!recipeName || !description || !seconds || !uses) {
        alert('Please fill in all required fields.');
        return;
    }

    const yaml = `
${recipeName}:
  ingredients:
  - ${ingredients.join('\n  - ')}
  effects:
  - ${effects.join('\n  - ')}
  material: POTION
  chatColor: ${chatColor}
  potionColor: ${potionColor}
  description: ${description}
  customModelData: ${customModelData}
  seconds: ${seconds}
  uses: ${uses}
    `.trim();

    document.getElementById('output').value = yaml;
}
