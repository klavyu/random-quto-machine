import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const colors = [
  "#16a085",
  "#27ae60",
  "#2c3e50",
  "#f39c12",
  "#e74c3c",
  "#9b59b6",
  "#FB6964",
  "#342224",
  "#472E32",
  "#BDBB99",
  "#77B1A9",
  "#73A857",
];

function App() {
  const [quoteData, setQuoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const convertedQuotes = data.quotes.map((q, i) => {
        return {
          id: i,
          quote: q.quote,
          author: q.author,
        };
      });
      setQuoteData((prevState) => {
        return {
          ...prevState,
          quoteList: convertedQuotes,
          quoteShowen:
            convertedQuotes[Math.floor(Math.random() * convertedQuotes.length)],
          colorChosen: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleNewQuoteClickHandler = () => {
    setQuoteData((prevState) => {
      return {
        ...prevState,
        quoteShowen: getRandomQuote(),
        colorChosen: getRandomColor(),
      };
    });
  };

  const getRandomQuote = () => {
    return quoteData.quoteList[
      Math.floor(Math.random() * quoteData.quoteList.length)
    ];
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (error) {
    console.log(error);
  }
  return (
    !isLoading &&
    quoteData &&
    !error && (
      <Content
        quoteData={quoteData}
        onClickHandler={handleNewQuoteClickHandler}
      />
    )
  );
}

export default App;

const Content = ({ quoteData, onClickHandler }) => {
  return (
    <div id="wrapper" className="container" style={{ paddingTop: 200 }}>
      <div className="card text-center w-60 mx-auto">
        <Title />
        <div id="quote-box" className="card-body">
          <DynamicStyles quoteData={quoteData} />
          <QuoteBox quote={quoteData.quoteShowen} />
          <Buttons onClickHandler={onClickHandler} />
        </div>
      </div>
    </div>
  );
};

const DynamicStyles = ({ quoteData }) => (
  <style>
    {"body {background-color: " +
      quoteData.colorChosen +
      "; color: " +
      quoteData.colorChosen +
      ";} button {background-color: " +
      quoteData.colorChosen +
      "!important; color: #fff!important;} a {color: " +
      quoteData.colorChosen +
      ";} button:hover {opacity: 0.5;} a:hover {color: " +
      quoteData.colorChosen +
      ";opacity: 0.5;}"}
  </style>
);

const Title = () => (
  <div id="title" className="card-header">
    <h1>Random Quote Machine</h1>
  </div>
);

const QuoteBox = ({ quote, onClickHandler, onCheckHandler, autoChecked }) => {
  return (
    <div className="card-text">
      <QuoteText quote={quote} />
      <QuoteAuthor author={quote.author}></QuoteAuthor>
    </div>
  );
};

const QuoteText = ({ quote }) => (
  <div id="text">
    <h2>{quote.quote}</h2>
  </div>
);

const QuoteAuthor = ({ author }) => (
  <div id="author">
    <h5 className="text-sm-end fst-italic">{author}</h5>
  </div>
);

const Buttons = ({ onClickHandler }) => (
  <div className="d-flex justify-content-between">
    <div>
      <a
        href="https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="
        id="tweet-quote"
        target="_top"
        className="m-3"
      >
        <span>
          <i className="fa fa-twitter"></i>Tweet this!
        </span>
      </a>
    </div>
    <div>
      <button id="new-quote" className="btn " onClick={onClickHandler}>
        New Quote
      </button>
    </div>
  </div>
);
