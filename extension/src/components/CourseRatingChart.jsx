import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Mock data
const data = [
    { class: 'BIO152', difficulty: 4, helpfulness: 2, professor: 'Caleb Rounds', date: '2024-11-20' },
    { class: 'BIO151', difficulty: 4, helpfulness: 1, professor: 'Caleb Rounds', date: '2024-11-18' },
    { class: 'BIO152', difficulty: 3, helpfulness: 4, professor: 'Caleb Rounds', date: '2024-11-18' },
    { class: 'BIO152', difficulty: 4, helpfulness: 1, professor: 'Caleb Rounds', date: '2024-11-13' },
    { class: 'BIO151', difficulty: 4, helpfulness: 2, professor: 'Caleb Rounds', date: '2024-11-11' },
    { class: 'BIO151', difficulty: 3, helpfulness: 4, professor: 'Caleb Rounds', date: '2024-10-29' },
    { class: 'BIO151', difficulty: 4, helpfulness: 2, professor: 'Caleb Rounds', date: '2024-10-24' },
    { class: 'BIO151', difficulty: 4, helpfulness: 2, professor: 'Caleb Rounds', date: '2024-10-22' },
    { class: 'BIO152', difficulty: 3, helpfulness: 4, professor: 'Caleb Rounds', date: '2024-09-18' },
    { class: 'BIO152', difficulty: 3, helpfulness: 4, professor: 'Caleb Rounds', date: '2024-06-06' },
    { class: 'BIO152', difficulty: 3, helpfulness: 5, professor: 'Caleb Rounds', date: '2024-05-24' },
    { class: 'BIO152', difficulty: 2, helpfulness: 4, professor: 'Caleb Rounds', date: '2024-05-23' }
];

// Transform data to calculate a "rating" as the average of difficulty and helpfulness
const transformedData = data.map((entry) => ({
  date: entry.date,
  rating: (entry.difficulty + entry.helpfulness) / 2, // Average of difficulty and helpfulness
}));

function CourseRatingChart() {
  return (
    <LineChart width={800} height={400} data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="rating" stroke="#8884d8" name="Rating" />
    </LineChart>
  );
};

export default CourseRatingChart;
