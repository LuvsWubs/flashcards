var basic = require('./basicCards');
var Cloze = require('./clozeCards');
var fs = require('fs');
var inquirer = require('inquirer');
const beginPrompt =   {
    message: 'Would you like to create a new flashcards or would you like to review your existing flashcards?',
    type: 'list',
    choices: ['Create a new flashcard', 'Review your existing flashcards'],
    name: 'initialQ'
  };
  const reviewPrompt = {
    message: 'Would you like to review the flashcards you have created?',
    name: 'flashcardReviewer',
    type: 'list',
    choices: ['Y', 'N']
  };

function beginFlashCard(){
  inquirer.prompt([beginPrompt])
  .then(function(answer) {
    if (answer.initialQ === 'Create a new flashcard') {
      inquirer.prompt([{
        message: 'Would you like to create a basic or cloze flashcard?',
        type: 'list',
        choices: ["Create a Basic FlashCard", "Create a Cloze FlashCard"],
        name: 'cardChoice'
      }]).then(function(result) {
        console.log('RESULT: ', result);
        switch (result.cardChoice) {
          case 'Create a Basic FlashCard':
            console.log(' WE ARE CREATING A BASIC', result.cardChoice);
            return createFlashcard();
            break;
          case 'Create a Cloze FlashCard':
            console.log('the cloze card functin is working!');
            return createClozeCard();
            break;
          default:
            text = 'Please select a valid option',
            console.log(result);
            //return result;
        }
      })
    } else  {
      viewFlashcards()
    }

});
}

function createFlashcard() {
  var createNewCardPrompt = {
    message: 'Would you like to create another card?',
    type: 'list',
    choices: ["Y", "N"],
    name: 'result'
  };
  var questionPrompt = {
    type: "input",
    message: 'Type your flashcard question here...',
    name: 'flashcardQ'
  };
  var answerPrompt = {
    type: "input",
    message: 'What is the answer to your question?',
    name: 'flashcardAnswer'
  };

  qPrompt(questionPrompt)
  .then(function(questionResult) {
    console.log('question result: ', questionResult);
    qPrompt(answerPrompt)
    .then(function(answerResult){
        // console.log('question successfully submitted', questionResult.question);
        // console.log('answer successfully submitted', answerResult.answer);
        var basicCard = new basic(questionResult.flashcardQ, answerResult.flashcardAnswer);
        writeFlashcard(basicCard);
        qPrompt(createNewCardPrompt)
        .then(function(promptAnswer) {
          if (promptAnswer.result === 'Y') {
            createFlashcard();
          } else {
            qPrompt(reviewPrompt)
            .then(function(reviewAnswer){
              // console.log(reviewAnswer);
              switch (reviewAnswer.flashcardReviewer) {
                case 'Y' : {
                  viewFlashcards();
                }
                break
                case 'N' : {
                  return;
                }
                break
                default :
                  return;
              }
            })
          }
          // console.log(' WHAT IS OUR PROMPT ANSWER', promptAnswer);
        })
      })
  })
};

function createClozeCard() {
      var questionPrompt = {
        type: 'input',
        message: 'Type your flashcard question here...',
        name: 'flashcardQ'
      };
      var clozeSpec = {
        type: 'input',
        message: 'What word(s) would you like to omit from view when reviewing this card?',
        name: 'flashcardCloze'
      };
      var answerPrompt = {
        type: 'input',
        message: 'What is the answer to your question?',
        name: 'flashcardAnswer'
      };

      qPrompt(questionPrompt)
      .then(function(questionResult) {
        qPrompt(clozeSpec)
        .then(function(clozeResult) {
          var clozure = new Cloze(questionResult.flashcardQ, clozeResult.flashcardCloze);
           writeFlashcard(clozure);

            qPrompt(beginPrompt)
            .then(function(promptAnswer) {
              console.log('prompt answer: ', promptAnswer);
              if (promptAnswer.initialQ === 'Create a new flashcard') {
                createFlashcard();
              } else {
                console.log('review prompt is working ');
                qPrompt(reviewPrompt)
                .then(function(reviewAnswer){
                  console.log(reviewAnswer);
                  switch (reviewAnswer.flashcardReviewer) {
                    case 'Y' : {
                      viewFlashcards();
                    }
                    break
                    case 'N' : {
                      return;
                    }
                    break
                    default :
                      return;
                  }
                })
              }
            })
          })
      })
};

function qPrompt(questionObj) {
  console.log(' WHAT IS OUR NEW QUESTION OBJ', questionObj);
  return inquirer.prompt([questionObj])
}

function viewFlashcards() {
  fs.readFile('./flashcards.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
  });
};

function writeFlashcard(card) {
  card = JSON.stringify(card) + "- ";
  console.log(card);
  fs.appendFile('./flashcards.txt', card, function(err) {
    if (err) throw err;
    console.log('data was appended');
  })
};

beginFlashCard();
