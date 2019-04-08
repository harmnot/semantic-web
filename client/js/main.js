$("#toggle").click(function() {
  $(this).toggleClass("active");
  $("#overlay").toggleClass("open");
});

const loadDashboard = async () => {
  const giveToken = await fetch(`./myaframe.html`, {
    method: "GET"
  });
  const getIt = await giveToken.text();
  $(".container-nav").html(getIt);
  $("#submit").hide();
};

const loadHome = async () => {
  const giveToken = await fetch(`./homepageasyn.html`, {
    method: "GET"
  });
  const getIt = await giveToken.text();
  $(".container-nav").html(getIt);
};

if (localStorage.getItem("token")) {
  $("#isLoggin").hide();
  $("#logout").show();
  $("#homepag").hide();
  $(".footer").hide();
  $(".container-nav").css({ height: "50%" });
  loadDashboard();
} else {
  $("#homepag").show();
  $("#logout").hide();
  $("#isLoggin").show();
}

async function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  const id_token = googleUser.getAuthResponse().id_token;
  $("#logout").show();
  $("#isLoggin").hide();
  $("#homepag").hide();
  $(".footer").hide();
  $(".container-nav").css({ height: "50%" });
  loadDashboard();

  const giveToken = await fetch(`http://localhost:4000/login`, {
    method: "POST",
    body: JSON.stringify({
      token: id_token
    }),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  });

  const receive = await giveToken.json();
  console.log(receive, "ini token");
  localStorage.setItem("token", receive);
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    localStorage.removeItem("token");
    $("#isLoggin").show();
    $("#logout").hide();
    $("#homepag").show();
    $(".footer").show();
    loadHome();
    console.log("User signed out.");
  });
}

function myFunction() {
  const x = document.getElementById("quiz");
  $("#submit").show();
  $("#explore").hide();
  $("#klik").hide();
  $("#vr").hide();
  fetch("http://localhost:4000/question", { method: "GET" })
    .then(res => res.json())
    .then(gotIt => {
      let resultsContainer = document.getElementById("results");
      let submitButton = document.getElementById("submit");
      generateQuiz(gotIt, x, x, submitButton);

      function generateQuiz(
        questions,
        quizContainer,
        resultsContainer,
        submitButton
      ) {
        function showQuestions(questions, quizContainer) {
          let output = [];
          let answers;

          // for each question...
          for (let i = 0; i < questions.length; i++) {
            // first reset the list of answers
            answers = [];

            // for each available answer...
            for (letter in questions[i].answers) {
              answers.push(
                "<label>" +
                  '<input type="radio" name="question' +
                  i +
                  '" value="' +
                  letter +
                  '">' +
                  letter +
                  ": " +
                  questions[i].answers[letter] +
                  "</label> <br>"
              );
            }

            // add this question and its answers to the output
            const pertanyaan = `
              <div class="card ">
              <div class="card-header question">
                  ${questions[i].question}
                 </div>

                 <div class="card-body answers">
                          ${answers.join("")}
                   </div>
              </div>`;

            output.push(pertanyaan);
          }

          // finally combine our output list into one string of html and put it on the page
          quizContainer.innerHTML = output.join("");
        }

        function showResults(questions, quizContainer, resultsContainer) {
          // gather answer containers from our quiz
          let answerContainers = quizContainer.querySelectorAll(".answers");

          // keep track of user's answers
          let userAnswer = "";
          let numCorrect = 0;

          // for each question...
          for (let i = 0; i < questions.length; i++) {
            // find selected answer
            userAnswer = (
              answerContainers[i].querySelector(
                "input[name=question" + i + "]:checked"
              ) || {}
            ).value;

            if (userAnswer === questions[i].correctAnswer) {
              numCorrect++;
              answerContainers[i].style.color = "lightgreen";
            } else {
              answerContainers[i].style.color = "red";
            }
          }

          resultsContainer.innerHTML =
            "your brain remember " + numCorrect + " out of " + questions.length;
        }

        showQuestions(questions, quizContainer);
        submitButton.onclick = function() {
          showResults(questions, quizContainer, resultsContainer);
        };
      }
    })
    .catch(err => {
      console.log(err);
    });
}
