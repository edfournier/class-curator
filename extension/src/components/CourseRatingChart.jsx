import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CourseRatingChart = ({ data }) => {
    if (data) {
        data = data.map(item => {
            // Create key from semester and year
            return {
                ...item,
                key: `${item.semester.charAt(0)}-${item.year % 100}`,
            };
        });

        data = data.toSorted((a, b) => {
            // Sort by increasing year, then season
            if (a.year === b.year) {
                return a.semester === "SPRING" ? -1 : 1;
            }
            return a.year - b.year;
        });
    }

    return (
        <ResponsiveContainer width={250} height={200}>
            <LineChart data={data}>
                <CartesianGrid />
                <XAxis
                    dataKey="key"
                    tick={{ angle: -45, textAnchor: "end" }}
                />
                <YAxis domain={[0, 5]} />
                <Legend />
                <Line type="monotone" dataKey="helpfulness" stroke="#4caf50" name="Quality" dot={false} />
                <Line type="monotone" dataKey="difficulty" stroke="#f44336" name="Difficulty" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CourseRatingChart;