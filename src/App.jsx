//React
import { useState, useCallback, useEffect} from 'react'

//CSS
import './App.css'


//Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

//Data
import { wordsList } from './data/words'

const stages = [
  {id:1, name:'start'},
  {id:2, name:'game'},
  {id:3, name:'end'}
]

function App() {

  const actualGuesses = 3;

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words, setWords] = useState(wordsList)
  const [pickedCategory, setPickedCategory] = useState('')
  const [pickedWord, setPickedWord] = useState('')
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(actualGuesses)
  const [score, setScore] = useState(0)


  const pickAWordAndCategory = useCallback(() => {
    //Pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(words).length)]


    //Pick a random Word
    const word = words[category][Math.floor(Math.random() * words[category].length)];


    return {word, category}
  }, [words])

  //Start the Game
  const start = useCallback( () => {
    //Cleaning all letter states
    clearLetterStates()

    //Pick the word and category
    const {category, word} = pickAWordAndCategory();


    //Creating a array of letters
    let letters = word.split('')
    letters = letters.map((letter) => letter.toLowerCase())


    //Populating states
    setPickedCategory(category)
    setPickedWord(word)
    setLetters(letters)

    setGameStage(stages[1].name)
  }, [pickAWordAndCategory])

  //Verify Letter
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //Check if letter has already been used
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) return

    //Push guessed letter or remove a chance
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }


  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //Checks if guesses end
  useEffect(() => {
    
    if(guesses <= 0) {
      clearLetterStates();

      setGameStage(stages[2].name)
    }
    
  }, [guesses]);

  //Checks win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if(letters.length !== 0 && (guessedLetters.length === uniqueLetters.length)) {
      //Add score
      setScore((actualScore) => actualScore += 100)

      //Restart Game
      start();
    }
  }, [guessedLetters, letters, start]);

  //Restart the Game
  const resetGame = () => {

    setScore(0);
    setGuesses(actualGuesses)

    setGameStage(stages[0].name)
  }


  return (
    <div className="App">
      {gameStage === "start" && <StartScreen start={start} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver resetGame={resetGame} score={score} />}
    </div>
  );
}

export default App
