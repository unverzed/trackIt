import Header from "./header";
import Footer from "./footer";
import styled from "styled-components";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import button from "./../assets/button.png";
import UserContext from "../contexts/usercontext";
import trash from "./../assets/trash.png";
import Loading from "./loading";

export default function Habits() {
  const [habits, setHabits] = useState("");
  const [newHabit, setNewHabit] = useState(false);
  const [hasHabit, setHasHabit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectDay, setSelectDay] = useState([]);
  const [userHabit, setUserHabit] = useState([]);
  const { token } = useContext(UserContext);
  const days = ["D", "S", "T", "Q", "Q", "S", "S"];
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  function habitsPost(event) {
    event.preventDefault();
    setIsLoading(true);

    const data = {
      name: habits,
      days: selectDay,
    };
    if (selectDay.length > []) {
      const promise = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits",
        data,
        config
      );

      promise.then((response) => {
        setNewHabit(false);
        setHasHabit(data);
        setHabits("");
        setSelectDay("");
      });

      promise.catch((error) => {
        setIsLoading(false);
        alert("Dados inválidos, por favor tente novamente");
      });
    } else {
      alert("É preciso preencher ao menos um dia");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const promise = axios.get(
      "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits",
      config
    );

    promise.catch((error) => {});

    promise.then((response) => {
      setUserHabit(response.data);
      setNewHabit(false);
    });
  }, [hasHabit]);

  function deleteHabit(id) {
    const confirm = window.confirm("Deseja excluir o hábito?");

    if (confirm === true) {
      const promise = axios.delete(
        `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}`,
        config
      );

      promise.then((response) => {
        setHasHabit(true);
      });
      promise.catch((error) => {});
    }
  }

  function newCard() {
    setNewHabit(true);
    setIsLoading(false);
  }

  return (
    <>
      <Header />
      <Main>
        <div>
          <h1>Meus hábitos</h1>
          <img src={button} onClick={newCard} />
        </div>
        {newHabit === true ? (
          <Form onSubmit={habitsPost}>
            <Name
              type="text"
              placeholder="nome do habito"
              value={habits}
              onChange={(e) => setHabits(e.target.value)}
              disabled={isLoading}
              required
            ></Name>
            <div className="all-days">
              {days.map((day, id) => {
                return (
                  <div
                    className="button-day"
                    key={id}
                    onClick={() => {
                      setSelectDay([...selectDay, id]);
                    }}
                    style={
                      selectDay.includes(id)
                        ? { backgroundColor: "#CFCFCF", color: "#FFFFFF" }
                        : {}
                    }
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="buttons">
              <p onClick={() => setNewHabit(false)}>Cancelar</p>
              <button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Salvar"}
              </button>
            </div>
          </Form>
        ) : (
          <></>
        )}
        {userHabit.length === 0 ? (
          <p className="no-habit">
            Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para
            começar a trackear!
          </p>
        ) : (
          userHabit.map((habit) => {
            const { name } = habit;
            return (
              <HabitCreated key={habit.id}>
                <div className="habits">
                  <p className="habits-name">{name}</p>
                  <img
                    className="trash"
                    src={trash}
                    onClick={() => deleteHabit(habit.id)}
                  />
                </div>
                <div className="all-days">
                  {days.map((day, id) => {
                    return (
                      <button
                        className="button-days"
                        key={id}
                        style={
                          habit.days.includes(id)
                            ? { backgroundColor: "#CFCFCF", color: "#FFFFFF" }
                            : {}
                        }
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </HabitCreated>
            );
          })
        )}
      </Main>
      <Footer />
    </>
  );
}

const Main = styled.main`
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;

  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: calc(28px + 70px);
    width: 100%;
  }

  h1 {
    font-size: 22.976px;
    line-height: 29px;
    color: #126ba5;
    margin-left: 17px;
  }

  .no-habit {
    margin-top: 29px;
    font-size: 17.976px;
    line-height: 22px;
    color: #666666;
    margin-left: 17px;
  }

  img {
    width: 40px;
    height: 35px;
    margin-right: 18px;
  }
`;

const Form = styled.form`
  margin-top: 22px;
  width: 340px;
  height: 180px;
  background: #ffffff;
  border-radius: 5px;

  button {
    width: 84px;
    height: 35px;
    background-color: #52b6ff;
    font-size: 15.976px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
    border-radius: 4.63636px;
    border: none;
    margin-right: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    margin-bottom: 100px;
  }

  .button-day {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border: 1px solid #d5d5d5;
    border-radius: 5px;
    margin-top: 8px;
    font-size: 19.976px;
    line-height: 25px;
    color: #dbdbdb;
    text-align: center;
    padding-top: 0;
    justify-content: center;
  }

  p {
    font-size: 15.976px;
    line-height: 20px;
    color: #52b6ff;
    margin-right: 23px;
  }

  .all-days {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 0;
    display: flex;
    justify-content: flex-start;
    margin-left: 19px;
    gap: 4px;
  }

  .buttons {
    padding-top: 0px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 29px;
    margin-bottom: 15px;
  }
`;

const Name = styled.input`
  width: 303px;
  height: 45px;
  background: #ffffff;
  border: 1px solid #d5d5d5;
  box-sizing: border-box;
  border-radius: 5px;
  margin-top: 18px;
  margin-left: 19px;
  font-size: 19.976px;
  line-height: 25px;
`;

const HabitCreated = styled.section`
  display: flex;
  flex-direction: column;
  width: 340px;
  height: 91px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-top: 20px;

  .habits-name {
    font-size: 19.976px;
    line-height: 25px;
    color: #666666;
    margin-top: 13px;
    margin-left: 15px;
  }

  .trash {
    width: 13px;
    height: 15px;
    margin-top: 11px;
  }

  .button-days {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border: 1px solid #d5d5d5;
    border-radius: 5px;
    margin-top: 8px;
    font-size: 19.976px;
    line-height: 25px;
    color: #dbdbdb;
    text-align: center;
  }

  .all-days {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 0;
    display: flex;
    justify-content: flex-start;
    margin-left: 19px;
    gap: 4px;
    margin-top: 4px;
    padding-bottom: 15px;
  }

  .habits {
    display: flex;
    justify-content: space-between;
    padding-top: 0;
  }
`;
