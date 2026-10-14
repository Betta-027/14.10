import { useEffect, useState } from "react";

type Order = { id: number; title: string; completed: boolean };

function Task4() {
  const [online, setOnline] = useState(navigator.onLine);
  const [width, setWidth] = useState(window.innerWidth);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <main>
      <h1>Панель оператора</h1>
      <p>Статус сети: {online ? "Онлайн" : "Офлайн"}</p>
      <p>Ширина окна: {width}px</p>
      <p>Время работы: {seconds} сек.</p>
    </main>
  );
}

function Task5() {
  const [orderId, setOrderId] = useState(1);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setOrder(null);
    fetch(`https://jsonplaceholder.typicode.com/todos/${orderId}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: Order) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [orderId]);

  useEffect(() => {
    if (!auto) return;
    const timerId = window.setInterval(() => {
      setOrderId((id) => (id === 10 ? 1 : id + 1));
    }, 5000);
    return () => window.clearInterval(timerId);
  }, [auto]);

  return (
    <main>
      <h1>Отслеживание заказа</h1>
      <select value={orderId} onChange={(event) => setOrderId(Number(event.target.value))}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
          <option key={id} value={id}>Заказ #{id}</option>
        ))}
      </select>
      <button onClick={() => setAuto((value) => !value)}>
        {auto ? "Выключить автообновление" : "Включить автообновление"}
      </button>
      {loading && <p>Загрузка...</p>}
      {error && <p>Ошибка: {error}</p>}
      {order && (
        <p>Заказ #{order.id}: {order.completed ? "выполнен" : "обрабатывается"} — {order.title}</p>
      )}
    </main>
  );
}

function App() {
  const [task, setTask] = useState(4);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
        {[4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setTask(n)}
            style={{
              background: task === n ? "#2468a9" : "#ccc",
              color: task === n ? "white" : "#000",
              padding: "8px 16px",
              border: 0,
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Задание {n}
          </button>
        ))}
      </div>
      <hr />
      {task === 4 && <Task4 />}
      {task === 5 && <Task5 />}
    </main>
  );
}

export default App;