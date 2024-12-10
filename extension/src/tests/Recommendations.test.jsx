import { render, screen } from '@testing-library/react';
import Recommendations from '../components/Recommendations';

describe("Recommendations Component", () => {
    test('renders recommendations correctly with courses from friends, tags, and peers', () => {
        const recs = {
            friends: [
                { course: { code: 'CS101' }, networkCount: 3 },
                { course: { code: 'CS102' }, networkCount: 2 },
            ],
            tags: [
                { course: { code: 'CS201' }, networkCount: 0 },
            ],
            peers: [
                { course: { code: 'CS301' }, networkCount: 5 },
            ],
        };

        render(<Recommendations recs={recs} />);

        // Check if each course code is rendered
        expect(screen.getByText('CS101')).toBeInTheDocument();
        expect(screen.getByText('CS102')).toBeInTheDocument();
        expect(screen.getByText('CS201')).toBeInTheDocument();
        expect(screen.getByText('CS301')).toBeInTheDocument();

        // Check the tooltips for each course
        const cs101Bubble = screen.getByText('CS101').closest('div');
        expect(cs101Bubble).toHaveAttribute('title', 'Based on 3 friends!');
        
        const cs201Bubble = screen.getByText('CS201').closest('div');
        expect(cs201Bubble).toHaveAttribute('title', 'Based on your tags!');
        
        const cs301Bubble = screen.getByText('CS301').closest('div');
        expect(cs301Bubble).toHaveAttribute('title', 'Based on 5 similar peers!');
    });

    test('renders fallback message when no recommendations are available', () => {
        const recs = { friends: [], tags: [], peers: [] };

        // Check for the fallback message when no courses are recommended
        render(<Recommendations recs={recs} />);
        expect(screen.getByText("We don't have enough info to recommend a course yet. Explore the app more and check back soon!")).toBeInTheDocument();
    });
});