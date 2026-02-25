import {useEffect, useState} from "react";
import axios from "axios";

export default function Admin() {
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/appointments")
        .then(res => setList(res.data));
    }, []);
    return (
        <div>
            <h1>Admin Termine</h1>
            {list.map(a =>(
                <div key={a.id}>
                    {a.firstName} {a.lastName} -{a.date} {a.time}
                    <a href={`http://localhost:8080/api/appointments/calendar/${a.id}`}>
                        📅 Kalender
                    </a>
                </div>
            ))}
        </div>
    );
}