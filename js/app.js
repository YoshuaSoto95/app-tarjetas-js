        // Estado inicial
        let state = {
            balance: 0,
            transactions: [],
            cardImage: "https://cdn-icons-png.flaticon.com/512/196/196578.png",
            cardStyle: "card-style-1",
            customColors: {
                color1: "#6e8efb",
                color2: "#a777e3"
            }
        };

        // Elementos del DOM
        const balanceElement = document.getElementById('balance');
        const transactionList = document.getElementById('transaction-list');
        const depositBtn = document.getElementById('deposit-btn');
        const withdrawBtn = document.getElementById('withdraw-btn');
        const amountInput = document.getElementById('amount');
        const cardImageElement = document.getElementById('card-image');
        const cardElement = document.getElementById('card-element');
        const imageOptions = document.querySelectorAll('.image-option');
        const designOptions = document.querySelectorAll('.design-option');
        const color1Input = document.getElementById('color1');
        const color2Input = document.getElementById('color2');
        const applyColorsBtn = document.getElementById('apply-colors');
        const notificationElement = document.getElementById('notification');

        // Mostrar notificación
        function showNotification(message, type = 'success') {
            notificationElement.textContent = message;
            notificationElement.className = `notification ${type} show`;
            
            setTimeout(() => {
                notificationElement.classList.remove('show');
            }, 3000);
        }

        // Cargar datos del localStorage al iniciar
        function loadState() {
            const savedState = localStorage.getItem('prepaidCardState');
            if (savedState) {
                state = JSON.parse(savedState);
                updateUI();
            }
        }

        // Guardar datos en localStorage
        function saveState() {
            localStorage.setItem('prepaidCardState', JSON.stringify(state));
        }

        // Actualizar la interfaz de usuario
        function updateUI() {
            balanceElement.textContent = state.balance.toFixed(2);
            renderTransactions();
            cardImageElement.src = state.cardImage;
            
            // Aplicar estilo de tarjeta
            cardElement.className = 'card';
            cardElement.classList.add(state.cardStyle);
            
            // Si es estilo personalizado, aplicar colores
            if (state.cardStyle === 'card-style-custom') {
                cardElement.style.setProperty('--color1', state.customColors.color1);
                cardElement.style.setProperty('--color2', state.customColors.color2);
            }
            
            // Actualizar selección de imágenes
            imageOptions.forEach(option => {
                if (option.dataset.image === state.cardImage) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
            
            // Actualizar selección de diseños
            designOptions.forEach(option => {
                if (option.dataset.style === state.cardStyle) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
            
            // Actualizar colores del picker
            color1Input.value = state.customColors.color1;
            color2Input.value = state.customColors.color2;
        }

        // Renderizar transacciones
        function renderTransactions() {
            transactionList.innerHTML = '';
            
            if (state.transactions.length === 0) {
                transactionList.innerHTML = '<li>No hay movimientos aún</li>';
                return;
            }
            
            state.transactions.forEach(transaction => {
                const li = document.createElement('li');
                li.className = `transaction-item ${transaction.type}`;
                
                const typeSpan = document.createElement('span');
                typeSpan.textContent = transaction.type === 'deposit' ? 'Depósito' : 'Retiro';
                
                const amountSpan = document.createElement('span');
                amountSpan.textContent = `${transaction.type === 'deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)}`;
                
                const dateSpan = document.createElement('span');
                dateSpan.textContent = new Date(transaction.date).toLocaleString();
                
                li.appendChild(typeSpan);
                li.appendChild(amountSpan);
                li.appendChild(dateSpan);
                
                transactionList.appendChild(li);
            });
        }

        // Realizar un depósito
        function deposit() {
            const amount = parseFloat(amountInput.value);
            
            if (isNaN(amount) || amount <= 0) {
                showNotification('Por favor ingrese una cantidad válida', 'error');
                return;
            }
            
            state.balance += amount;
            state.transactions.unshift({
                type: 'deposit',
                amount: amount,
                date: new Date().toISOString()
            });
            
            saveState();
            updateUI();
            amountInput.value = '';
            
            showNotification(`Depósito exitoso: +$${amount.toFixed(2)}`);
        }

        // Realizar un retiro
        function withdraw() {
            const amount = parseFloat(amountInput.value);
            
            if (isNaN(amount) || amount <= 0) {
                showNotification('Por favor ingrese una cantidad válida', 'error');
                return;
            }
            
            if (amount > state.balance) {
                showNotification('Fondos insuficientes', 'error');
                return;
            }
            
            state.balance -= amount;
            state.transactions.unshift({
                type: 'withdrawal',
                amount: amount,
                date: new Date().toISOString()
            });
            
            saveState();
            updateUI();
            amountInput.value = '';
            
            showNotification(`Retiro exitoso: -$${amount.toFixed(2)}`);
        }

        // Cambiar imagen de la tarjeta
        function changeCardImage(imageUrl) {
            state.cardImage = imageUrl;
            saveState();
            updateUI();
            showNotification('Imagen de tarjeta actualizada');
        }

        // Cambiar diseño de la tarjeta
        function changeCardStyle(style) {
            state.cardStyle = style;
            saveState();
            updateUI();
            showNotification('Diseño de tarjeta actualizado');
        }

        // Aplicar colores personalizados
        function applyCustomColors() {
            state.cardStyle = 'card-style-custom';
            state.customColors = {
                color1: color1Input.value,
                color2: color2Input.value
            };
            saveState();
            updateUI();
            showNotification('Colores personalizados aplicados');
        }

        // Event Listeners
        depositBtn.addEventListener('click', deposit);
        withdrawBtn.addEventListener('click', withdraw);
        
        imageOptions.forEach(option => {
            option.addEventListener('click', () => {
                changeCardImage(option.dataset.image);
            });
        });
        
        designOptions.forEach(option => {
            option.addEventListener('click', () => {
                changeCardStyle(option.dataset.style);
            });
        });
        
        applyColorsBtn.addEventListener('click', applyCustomColors);

        // Inicializar la aplicación
        loadState();