import React, { useEffect, useState } from 'react';
import './App.css';
import speaker from './assets/speaker.svg'
import github from './assets/github.svg'
import coffee from './assets/coffee.svg'
import reset from './assets/reset.svg'
import wrongSoundEffect from './assets/wrong-answer.mp3'
import correctSoundEffect from './assets/correct-answer.mp3'
import wordsList from './data/audio-words.json'
import loadingAudio from './assets/loading-audio.mp3'

function App() {
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [count, setCount] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [randomWord, setRandomWord] = useState({})
  const [definition, setDefinition] = useState({})

  const defaultAudio = new Audio(loadingAudio)
  const correctSound = new Audio(correctSoundEffect)
  const wrongSound = new Audio(wrongSoundEffect)

  const playAudio = () => {
    const pronounciation = new Audio(randomWord?.audio) || defaultAudio
    pronounciation.playbackRate = 0.8
    pronounciation.play()
  }

  // const randomWord = "Definition"

  const onValueChange = (e) => {
    setAnswer(e.target.value)
  }

  const onSubmit = () => {
    // Check if word matches
    if (answer.trim()) {
      setCount(count+1)
      setShowAnswer(true)
      if (answer.trim().toLowerCase() === randomWord.word.toLowerCase()) {
        setScore(score+10)
        setCorrect(true)
        correctSound.volume = 0.2
        correctSound.play()
      } else {
        setCorrect(false)
        wrongSound.volume = 0.2
        wrongSound.play()
      }
    }
  }

  /**
   * Set new word, new audio
   * hide previous word
   * disable submit
   */
  const randomizeWord = () => {
    // Clear input and hide answer
    setShowAnswer(false)
    setAnswer('')
    
    const max = wordsList.length
    const min = 1
    const num = Math.floor(Math.random() * (max - min + 1)) + min
    const query = wordsList[num]
    setRandomWord(query)
    fetchDefinition(query?.word)
  }

  const fetchDefinition = async (query) => {
    /**
     *  Fetch meaning of the word from dictionaryapi.dev
     * https://api.dictionaryapi.dev/api/v2/entries/en/word
     * result[0]["phonetic"]   // pronounciation IPA
     * result[0]["meanings"][0].partOfSpeech   // noun, adj
     * result[0]["meanings"].definitions[0].definition   // definition
     * 
     * */
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
      .then(response => response.json())
      .then(data => {
        setDefinition({
          meaning: data[0]["meanings"][0]["definitions"][0].definition,
          partOfSpeech: data[0]["meanings"][0]["partOfSpeech"],
          phonetic: data[0]["phonetic"]
        })
      });
  }

  // Start from zero
  const resetGame = () => {
    setCount(0)
    setScore(0)
    setShowAnswer(false)
    // Get a new word
    randomizeWord()
  }

  const status = () => {
    if (score && count) {
      return `${score/10}/${count}`
    }
    return '0/0'
  }

  useEffect(() => {
    randomizeWord()
  }, [])

  return (
    <div className="">
      <nav>
        <div className="logo">
          <img alt="logo" src={coffee} width="25"/>
            <p className="title">can you spell me?</p>
          </div>
          <a href="https://github.com/jingerdev/react-pomodoro-app" target="_blank" rel="noreferrer"> 
            <img alt="repo_link" src={github} title="repo link"/>
          </a>
      </nav>

      <header className="">
        <section className="score"> <span>{score} pts</span>
          <div>{status()}</div>        
        </section>
        <section className="new-word">
          <span
            onClick={() => randomizeWord()}
            className="submit-new">
            new word
          </span>
        </section>
      </header>

      <div className="container">
        <p className={`random-word ${correct ? 'correct' : ''}`}>
         {showAnswer ? randomWord?.word : "?"}
        </p>
        <section className="word">
          <div className="meaning">
            <p className="speech">{definition?.partOfSpeech} ( {definition?.phonetic})</p>
            <p className="definition">{definition?.meaning}</p>
          </div>
          <img src={speaker} width={30} alt="audio-icon" className="speaker-icon" onClick={() => playAudio()} />        
        </section>

        <section className="answer">
          <input
            className="text"
            placeholder="spell it"
            style={{
              padding: 10,
              margin: 10
            }}
            defaultValue={answer}
            onChange={(e) => {onValueChange(e)}}
          />
        </section>
        <section>
          <button
            onClick={() => onSubmit()}
            className="submit-btn">
            Submit
          </button>
        </section>
        <section>
          <button
            onClick={() => resetGame()}
            className="submit-reset">
              <img alt="reset" src={reset} width="25" />
            Reset
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
