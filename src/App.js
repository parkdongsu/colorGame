import React, { useEffect, useState } from "react";
import styled from "styled-components";

const App = () => {
  const boardSize = 360;
  const defalutTime = 15;
  const maxStage = 100;
  const degreeOfDifficulty = 2;

  const [tileSize, setTileSize] = useState(boardSize / 2 - 4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stage, setStage] = useState(1);
  const [time, setTime] = useState(defalutTime);
  const [score, setScore] = useState(0);
  const [numOfTiles, setNumOfTiles] = useState();
  const [answer, setAnswer] = useState(0);
  const [baseColor, setBaseColor] = useState();
  const [answerColor, setAnswerColor] = useState();

  useEffect(() => {
    setNumOfTiles(getSize(stage));
  }, [stage]);

  useEffect(() => {
    setTileSize(getTileSize(boardSize, numOfTiles));
    setAnswer(getRandomValue(numOfTiles));
    setBaseColor(getRandomColor());
  }, [stage, numOfTiles]);

  useEffect(() => {
    setAnswerColor(
      getSimilarColor(baseColor, stage, maxStage, degreeOfDifficulty)
    );
  }, [baseColor]);

  useEffect(() => {
    if (time == 0) {
      setTimeout(() => {
        window.alert(`GAME OVER! \n스테이지: ${stage}, 점수: ${score}`);
        setIsPlaying(false);
      }, 200);
    }
    const countdown = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [time]);

  useEffect(() => {
    setStage(1);
    setTime(defalutTime);
    setTileSize(boardSize / 2 - 4);
    setScore(0);
    setIsPlaying(true);
  }, [isPlaying]);

  const getTileSize = (size, num) => {
    const length = size / Math.sqrt(num) - 4;
    return length;
  };

  const getSimilarColor = (color, value, limitValue, step) => {
    if (color != undefined) {
      const minRgbValue = 0x000000;
      let similarColor = "";
      const gap = (limitValue - value) * step;
      const beforeColor = color.replace("#", "0x");
      if (parseInt(beforeColor) - gap < minRgbValue) {
        similarColor = (beforeColor + gap).toString(16);
      } else {
        similarColor = (beforeColor - gap).toString(16);
      }
      similarColor = numToRgb(similarColor);
      return similarColor;
    }
  };

  const getRandomColor = () => {
    const preColor = Math.round(Math.random() * 0xffffff).toString(16);
    const color = numToRgb(preColor);
    return color;
  };

  const numToRgb = (num) => {
    let rgbValue = "";
    if (num.length < 6) {
      rgbValue = "#" + "0".repeat(6 - num.length) + num;
    } else {
      rgbValue = "#" + num;
    }
    return rgbValue;
  };

  const getRandomValue = (maxValue) => {
    const value = Math.floor(Math.random() * maxValue);
    return value;
  };

  const getSize = (stage) => {
    const size = Math.pow(Math.round((stage + 0.5) / 2) + 1, 2);
    return size;
  };

  const onClickAnswer = () => {
    setScore(score + Math.pow(stage, 3) * time);
    setStage(stage + 1);
    setTime(defalutTime);
  };

  const onClickBase = () => {
    if (time < 3) {
      setTime(0);
    } else {
      setTime(time - 3);
    }
  };

  return (
    <>
      <Header>
        스테이지: {stage}, 남은 시간: {time}, 점수: {score}
      </Header>
      <GameBoard
        style={{
          display: `flex`,
          flexWrap: "wrap",
          width: `${boardSize}px`,
          height: `${boardSize}px`,
        }}
      >
        {Array.from(Array(numOfTiles), (v, index) => {
          return index == answer ? (
            <Tile
              key={index}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                margin: `2px`,
                backgroundColor: `${answerColor}`,
              }}
              onClick={onClickAnswer}
            ></Tile>
          ) : (
            <Tile
              key={index}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                margin: `2px`,
                backgroundColor: `${baseColor}`,
              }}
              onClick={onClickBase}
            ></Tile>
          );
        })}
      </GameBoard>
    </>
  );
};
export default App;

const Header = styled.header``;

const GameBoard = styled.div``;

const Tile = styled.div``;
