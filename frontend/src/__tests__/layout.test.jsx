import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Layout from '../components/Layout.jsx';

describe('Layout', () => {
    it('shows current user and navigation links', () => {
        render(
            <MemoryRouter>
                <Layout auth={{ user: { username: 'admin', role: 'admin' } }} onLogout={() => {}}>
                    <h1>Dashboard content</h1>
                </Layout>
            </MemoryRouter>,
        );

        expect(screen.getByText('MusicHub')).toBeInTheDocument();
        expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
        expect(screen.getByText('Playlists')).toBeInTheDocument();
        expect(screen.getByText('Create playlist')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    });

    it('calls logout handler when logout button is clicked', () => {
        const onLogout = vi.fn();

        render(
            <MemoryRouter>
                <Layout auth={{ user: { username: 'admin', role: 'admin' } }} onLogout={onLogout}>
                    <div />
                </Layout>
            </MemoryRouter>,
        );

        fireEvent.click(screen.getByRole('button', { name: /logout/i }));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});
