import {useState, useEffect} from 'react';

export function Repeater(run: any, count: number = 5) {

    const [currentCount, setCount] = useState(5000);
    const timer = () => {
        setCount(currentCount - 1);
        if (currentCount % count === 0) {
            run();
        }
    };

    useEffect(() => {
        run();
    }, []);

    useEffect(() => {
        if (currentCount <= 0) {
            return;
        }
        const interval = setInterval(timer, 1000);
        return () => clearInterval(interval);
    }, [currentCount, run, timer]);

    return;
}
