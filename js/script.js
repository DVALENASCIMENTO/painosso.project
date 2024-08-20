document.addEventListener('DOMContentLoaded', () => {
    const topics = document.querySelectorAll('.topic');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const closeBtn = document.querySelector('.close');
    const closeHelpBtn = document.querySelector('.close-help');
    const playBtn = document.querySelector('.play-btn');
    const fontIncrease = document.querySelector('.font-increase');
    const fontDecrease = document.querySelector('.font-decrease');
    const helpBtn = document.querySelector('.help-btn');
    let fontSize = 16;
    let isSpeaking = false;
    let speechSynthesis = window.speechSynthesis;

    const backgroundSound = document.getElementById('background-sound');

    // Reproduz o áudio de fundo após interação do usuárioo
    document.body.addEventListener('click', () => {
        if (backgroundSound && backgroundSound.paused) {
            backgroundSound.play().catch(error => {
                console.error('Erro ao tocar o áudio:', error);
            });
        }
    });

    // Abre o popup com o conteúdo do tópico
    topics.forEach(topic => {
        topic.addEventListener('click', (e) => {
            e.preventDefault();
            const dataPopup = topic.getAttribute('data-popup');
            fetch(`data/${dataPopup}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.content && typeof data.content === 'string') {
                        popupText.innerHTML = data.content;
                        popup.style.display = 'block';
                    } else {
                        throw new Error('Invalid data format');
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar o conteúdo:', error);
                    popupText.innerHTML = 'Erro ao carregar o conteúdo.';
                    popup.style.display = 'block';
                });
        });
    });

    // Fecha o popup ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            if (isSpeaking) {
                speechSynthesis.cancel();
                playBtn.textContent = 'Play';
                isSpeaking = false;
            }
        }
    });

    // Fecha o popup ao clicar no botão de fechar
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        if (isSpeaking) {
            speechSynthesis.cancel();
            playBtn.textContent = 'Play';
            isSpeaking = false;
        }
    });

    // Abre o popup de ajuda
    helpBtn.addEventListener('click', () => {
        document.getElementById('help-popup').style.display = 'block';
    });

    // Fecha o popup de ajuda ao clicar no botão de fechar
    closeHelpBtn.addEventListener('click', () => {
        document.getElementById('help-popup').style.display = 'none';
    });

    // Controle do leitor de voz
    playBtn.addEventListener('click', () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            playBtn.textContent = 'Play';
        } else {
            let utterance = new SpeechSynthesisUtterance(popupText.textContent);
            speechSynthesis.speak(utterance);
            playBtn.textContent = 'Pause';
        }
        isSpeaking = !isSpeaking;
    });

    // Aumenta o tamanho da fonte
    fontIncrease.addEventListener('click', () => {
        fontSize += 2;
        popupText.style.fontSize = `${fontSize}px`;
    });

    // Diminui o tamanho da fonte
    fontDecrease.addEventListener('click', () => {
        fontSize = Math.max(fontSize - 2, 10); // Evita que a fonte fique muito pequena
        popupText.style.fontSize = `${fontSize}px`;
    });
});
