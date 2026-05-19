import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

describe('ProtectedRoute', () => {
    it('renders children when access allowed', () => {
        render(
            <MemoryRouter>
                <ProtectedRoute isAllowed>
                    <div>private page</div>
                </ProtectedRoute>
            </MemoryRouter>,
        );
        expect(screen.getByText('private page')).toBeInTheDocument();
    });

    it('redirects to login when access is not allowed', () => {
        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route
                        path="/private"
                        element={(
                            <ProtectedRoute isAllowed={false}>
                                <div>private page</div>
                            </ProtectedRoute>
                        )}
                    />
                    <Route path="/login" element={<div>login page</div>} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('login page')).toBeInTheDocument();
        expect(screen.queryByText('private page')).not.toBeInTheDocument();
    });
});
