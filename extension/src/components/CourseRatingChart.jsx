import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const CourseRatingChart = ({ data }) => {
    if (data) {
        data = data.map(item => {
            // Create key from semester and year
            return {
                ...item,
                key: `${item.session.semester.charAt(0)}-${item.session.year % 100}`,
            };
        });

        data = data.toSorted((a, b) => {
            // Sort by increasing year, then season
            if (a.session.year === b.session.year) {
                return a.session.semester === "SPRING" ? -1 : 1;
            }
            return a.session.year - b.session.year;
        });
    }

    return (
        <LineChart data={data} width={250} height={150}>
            <CartesianGrid />
            <XAxis dataKey="key" />
            <YAxis domain={[0, 5]} />
            <Legend />
            <Line type="monotone" dataKey="helpfulness" stroke="#4caf50" name="Quality" dot={false} />
            <Line type="monotone" dataKey="difficulty" stroke="#f44336" name="Difficulty" dot={false} />
        </LineChart>
    );
};

export default CourseRatingChart;