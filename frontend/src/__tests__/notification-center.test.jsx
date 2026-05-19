import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationCenter from '../components/NotificationCenter.jsx';

describe('NotificationCenter', () => {
    it('renders nothing for empty list', () => {
        const { container } = render(<NotificationCenter notifications={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders notifications', () => {
        render(<NotificationCenter notifications={[{ id: 1, title: 'playlist-updated', message: 'updated' }]} />);
        expect(screen.getByText('playlist-updated')).toBeInTheDocument();
        expect(screen.getByText('updated')).toBeInTheDocument();
    });
});
