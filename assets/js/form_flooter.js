document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Obtendo os valores do formulário
        const formData = new FormData(form);

        // Enviando os dados para o script PHP via Fetch API
        fetch("./assets/php/send-mail.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formMessage.innerHTML = "Mensagem enviada com sucesso!";
                formMessage.style.color = "green";
                form.reset(); // Limpa o formulário após o envio
            } else {
                formMessage.innerHTML = "Erro ao enviar a mensagem. Tente novamente.";
                formMessage.style.color = "red";
            }
        })
        .catch(error => {
            formMessage.innerHTML = "Erro no servidor. Tente mais tarde.";
            formMessage.style.color = "red";
        });
    });
});

