// define the time limit
let TIME_LIMIT = 60;
var randomParagraph = null;

let codeData = null;

let data = {
   easy: [
      { code: "console.log('Hello, world!');" },
      { code: 'let num1 = 5; let num2 = 10; let sum = num1 + num2; console.log(sum);' },
      { code: "let greeting = 'Welcome'; let name = 'John'; console.log(greeting + ', ' + name + '!');" },
      { code: 'let x = 5; let y = 10; let z = x + y; console.log(z);' },
      { code: "let str = 'Hello'; let name = 'World'; console.log(str + ', ' + name + '!');" },
      { code: 'let arr = [1, 2, 3, 4, 5]; console.log(arr.length);' },
   ],
   medium: [
      {
         code: 'function binarySearch(arr, target) { let left = 0; let right = arr.length - 1; while (left <= right) { let mid = Math.floor((left + right) / 2); if (arr[mid] === target) { return mid; } else if (arr[mid] < target) { left = mid + 1; } else { right = mid - 1; } } return -1; }',
      },
      { code: 'function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); } console.log(fibonacci(5));' },
      { code: 'let array = [1, 2, 3, 4, 5]; let sum = array.reduce((acc, curr) => acc + curr, 0); console.log(sum);' },
      {
         code: "class Person { constructor(name, age) { this.name = name; this.age = age; } getInfo() { return this.name + ' is ' + this.age + ' years old.'; } } let person = new Person('Alice', 30); console.log(person.getInfo());",
      },
      { code: 'function factorial(n) { if (n === 0 || n === 1) return 1; return n * factorial(n - 1); } console.log(factorial(5));' },
      { code: "let obj = { a: 1, b: 2, c: 3 }; for (let key in obj) { console.log(key + ': ' + obj[key]); }" },
      { code: 'let numbers = [1, 2, 3, 4, 5]; let squares = numbers.map(num => num * num); console.log(squares);' },
   ],
   hard: [
      {
         code: 'function mergeSort(arr) { if (arr.length <= 1) return arr; const middle = Math.floor(arr.length / 2); const left = arr.slice(0, middle); const right = arr.slice(middle); return merge(mergeSort(left), mergeSort(right)); } function merge(left, right) { let result = []; let leftIndex = 0; let rightIndex = 0; while (leftIndex < left.length && rightIndex < right.length) { if (left[leftIndex] < right[rightIndex]) { result.push(left[leftIndex]); leftIndex++; } else { result.push(right[rightIndex]); rightIndex++; } } return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex)); } console.log(mergeSort([5, 3, 8, 4, 2, 1]));',
      },
      {
         code: "function deepClone(obj) { if (obj === null || typeof obj !== 'object') return obj; let clone = Array.isArray(obj) ? [] : {}; for (let key in obj) { if (obj.hasOwnProperty(key)) { clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]; } } return clone; } let obj = { a: 1, b: { c: 2 } }; let clonedObj = deepClone(obj); console.log(clonedObj);",
      },
      {
         code: "async function fetchData() { try { const response = await fetch('https://api.example.com/data'); const data = await response.json(); console.log(data); } catch (error) { console.error('Error fetching data:', error); } } fetchData();",
      },
      {
         code: 'function binarySearch(arr, target) { let low = 0; let high = arr.length - 1; while (low <= high) { let mid = Math.floor((low + high) / 2); if (arr[mid] === target) return mid; else if (arr[mid] < target) low = mid + 1; else high = mid - 1; } return -1; } console.log(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 5));',
      },
      {
         code: 'class LinkedList { constructor() { this.head = null; } insert(value) { this.head = { value, next: this.head }; } print() { let current = this.head; while (current) { console.log(current.value); current = current.next; } } } let list = new LinkedList(); list.insert(1); list.insert(2); list.insert(3); list.print();',
      },
      {
         code: "async function fetchData() { try { const response = await fetch('https://api.example.com/data'); const data = await response.json(); console.log(data); } catch (error) { console.error('Error fetching data:', error); } } fetchData();",
      },
   ],
};

var randomIndex = Math.floor(Math.random() * data['easy'].length);
const paragraph = document.getElementById('paragraph');

const { code } = data['easy'][randomIndex];

// Append the formatted code snippet to the paragraph element
paragraph.innerHTML = code;


document.addEventListener('DOMContentLoaded', async function () {
   const userInput = document.getElementById('userInput');
   const paragraph = document.getElementById('paragraph');
   const result = document.getElementById('result');
   const difficultySelect = document.getElementById('difficulty');
   const startButton = document.getElementById('startButton');

   let timer_text = document.querySelector('.curr_time');
   let error_text = document.querySelector('.curr_errors');

   let startTime;
   let endTime;
   let timeRemaining; // Variable to store the remaining time
   let timeLimit = TIME_LIMIT; // Time limit in seconds (adjust as needed)

   let total_errors = 0;
   let timer = null;
   let isTyping = false;

   function calculateTypingSpeed(startTime, endTime, totalWords) {
      // Calculate time difference in milliseconds
      let timeDiff = endTime - startTime;

      // Convert time to minutes
      let timeInMinutes = timeDiff / (60 * 1000);

      // Calculate words per minute (WPM)
      let wordsPerMinute = totalWords / 5 / timeInMinutes;

      return Math.round(wordsPerMinute);
   }

   async function generateParagraph() {
      // fetch(filePath)
      //    .then((response) => response.json())
      //    .then((data) => {
            var randomIndex = Math.floor(Math.random() * codeData.length);
            const { code } = codeData[randomIndex];
            // Append the formatted code snippet to the paragraph element
            paragraph.innerHTML = code;
            timeLimit = TIME_LIMIT;

            timer_text.textContent = TIME_LIMIT;
         // })
         // .catch((error) => console.error('Error:', error));
   }

   // Function to update paragraph color based on user input
   function updateParagraph() {
      const inputText = userInput.value;
      let paragraphText = paragraph.textContent;
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

      if (inputText === paragraphText) {
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
      cell3.textContent = Math.round(time);

      var cell4 = row.insertCell();
      cell4.textContent = typingSpeed;

      var cell5 = row.insertCell();
      cell5.textContent = difficultySelect.value;
   }


   function finishGame() {
      // stop the timer
      clearInterval(timer);
      let attemptStatus = '';

      endTime = new Date().getTime();
      const elapsedTime = (endTime - startTime) / 1000; // in seconds

      let typingSpeed = calculateTypingSpeed(startTime, endTime, userInput.value.length);

      // Check if any of the child elements have the class "error-text"
      var errorTextElements = paragraph.getElementsByClassName('error-text');

      if (
         (userInput.value !== paragraph.textContent && userInput.value.length !== paragraph.textContent.length) ||
         errorTextElements.length > 0
      ) {
         result.innerHTML = '<span style="color: red;">Sorry, you exceeded the time limit. Please try again!</span>';
         attemptStatus = 'Not Complete';
         // typingSpeed = '-';
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
      let timeRemaining = timeLimit--;
      if(timeRemaining >= 0) {
         timer_text.textContent = Math.ceil(timeRemaining) + 's';
      }
      if (timeRemaining < 0) {
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

   // Pasting Disable
   userInput.addEventListener('paste', function (e) {
      e.preventDefault();
      alert(
         "Please note that the code cannot be pasted here as it's intended for your practice purposes. \n\nThank you for your understanding!",
      );
   });

   // After Choosing Difficulty, Level when user clicks on Start button it will update accordingly
   startButton.addEventListener('click', function () {
      const difficulty = difficultySelect.value;
      const current_time = document.getElementById('current_time');

      switch (difficulty) {
         case 'easy':
            codeData = data['easy'];
            current_time.innerHTML = '60s';
            TIME_LIMIT = 60;
            break;
         case 'medium':
            codeData = data['medium'];
            current_time.innerHTML = '80s';
            TIME_LIMIT = 80;
            break;
         case 'hard':
            codeData = data['hard'];
            current_time.innerHTML = '120s';
            TIME_LIMIT = 120;
            break;
         default:
            codeData = data['easy']; // Default to easy difficulty
            current_time.innerHTML = '60s';
            TIME_LIMIT = 60;
            break;
      }
      refreshGame();
   });
});
