import React from 'react';
import { GameCategories } from './GameCategories';
import { MainLayout } from '../MainLayout';

export function GamesPage() {
  return (
    <MainLayout>
      <div className="container py-8">
        <GameCategories />
      </div>
    </MainLayout>
  );
} 