// define the time limit
let TIME_LIMIT = 20;
var randomParagraph = null;

fetch('./assets/data.json')
   .then((response) => response.json())
   .then((data) => {
      var randomIndex = Math.floor(Math.random() * data.length);
      randomParagraph = data[randomIndex];
      const paragraph = document.getElementById('paragraph');
      paragraph.innerHTML = randomParagraph;
   })
   .catch((error) => console.error('Error:', error));

document.addEventListener('DOMContentLoaded', async function () {
   const userInput = document.getElementById('userInput');
   const paragraph = document.getElementById('paragraph');
   const result = document.getElementById('result');
   let timer_text = document.querySelector('.curr_time');
   let error_text = document.querySelector('.curr_errors');
   let startTime;
   let endTime;
   let timeRemaining; // Variable to store the remaining time
   let timeLimit = TIME_LIMIT; // Time limit in seconds (adjust as needed)

   let total_errors = 0;
   let timer = null;
   let isTyping = false;

   async function generateParagraph() {
      fetch('./assets/data.json')
         .then((response) => response.json())
         .then((data) => {
            var randomIndex = Math.floor(Math.random() * data.length);
            randomParagraph = data[randomIndex];
            paragraph.textContent = randomParagraph;
            timeLimit = TIME_LIMIT;

            timer_text.textContent = TIME_LIMIT;
         })
         .catch((error) => console.error('Error:', error));
   }

   // Function to update paragraph color based on user input
   function updateParagraph() {
      const inputText = userInput.value;
      const paragraphText = paragraph.textContent;
      let updatedHtml = '';

      for (let i = 0; i < paragraphText.length; i++) {
         if (i < inputText.length) {
            if (inputText[i] === paragraphText[i]) {
               updatedHtml += '<span style="color: green;">' + paragraphText[i] + '</span>';
            } else {
               updatedHtml += '<span style="color: red;" class="error-text">' + paragraphText[i] + '</span>';
               total_errors++; // Increment error count
            }
         } else {
            updatedHtml += paragraphText[i];
         }
      }

      if(inputText === paragraphText) {
         finishGame();
      }

      paragraph.innerHTML = updatedHtml;
      if (isTyping) {
         error_text.textContent = total_errors; // Show error count in real-time while typing
      }
   }


   function updateStatisticsTable(attempt, typingSpeed, time) {
      var tbody = document.getElementById('table-body');
      // Create a new row
      var row = tbody.insertRow();

      // Insert cells and set their text
      var cell1 = row.insertCell();
      cell1.textContent = attempt;

      var cell2 = row.insertCell();
      cell2.textContent = total_errors;

      var cell3 = row.insertCell();
      cell3.textContent = time;

      var cell4 = row.insertCell();
      cell4.textContent = typingSpeed;
   }

   function finishGame() {
      // stop the timer
      clearInterval(timer);
      let attemptStatus = '';

      endTime = new Date().getTime();
      const elapsedTime = (endTime - startTime) / 1000; // in seconds

      let typingSpeed = Math.round((paragraph.textContent.length / elapsedTime) * 60); // characters per minute
      typingSpeed = Math.max(1, Math.min(typingSpeed, 100)); // Limit typing speed between 1 and 100

      // Check if any of the child elements have the class "error-text"
      var errorTextElements = paragraph.getElementsByClassName('error-text');

      console.log('userInput.value !== paragraph.textContent ', userInput.value !== paragraph.textContent);
      console.log('userInput.value.length !== paragraph.textContent.length ', userInput.value.length !== paragraph.textContent.length);
      console.log(' errorTextElements.length > 0', errorTextElements.length > 0);
      if (
         userInput.value !== paragraph.textContent &&
         userInput.value.length !== paragraph.textContent.length ||
         errorTextElements.length > 0
      ) {
         result.innerHTML = '<span style="color: red;">Sorry, you exceeded the time limit. Please try again!</span>';
         attemptStatus = 'Not Complete';
         typingSpeed = '-';
      } else {
         result.textContent = 'Your typing speed is: ' + typingSpeed + ' characters per minute!';
         attemptStatus = 'Complete';
      }

      updateStatisticsTable(attemptStatus, typingSpeed, elapsedTime);
      // disable the input area
      userInput.disabled = true;
   }

   // Function to update timer
   function updateTimer() {
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - startTime) / 1000; // in seconds
      timeRemaining = timeLimit - elapsedTime;
      timer_text.textContent = Math.ceil(timeRemaining) + 's';
      if (timeRemaining <= 0) {
         finishGame();
      }
   }

   // Event listener for keyboard input
   userInput.addEventListener('input', function () {
      if (!isTyping) {
         isTyping = true; // Set flag to true when the user starts typing
         startTime = new Date().getTime();
         updateTimer();
         timer = setInterval(updateTimer, 1000);
      }

      updateParagraph();

      if (timeRemaining <= 0) {
         finishGame();
      }
   });

   // Function to be called when the refresh button is clicked
   async function refreshGame() {
      // Call your specific function here
      console.log('Game refreshed!');

      userInput.value = '';
      userInput.disabled = false;
      error_text.textContent = 0;
      total_errors = 0;
      result.textContent = '';
      isTyping = false;
      timer = null;

      await generateParagraph();
   }

   // Add event listener to the refresh button
   document.getElementById('refreshButton').addEventListener('click', refreshGame);

   userInput.addEventListener('paste', function(e) {
      e.preventDefault();
      console.log('Pasting has been disabled.');
  });
});
