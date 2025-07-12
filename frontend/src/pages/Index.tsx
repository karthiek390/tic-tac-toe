
import React from 'react';
import Header from '../components/Header';
import GameBoard from '../components/GameBoard';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Tic-Tac-Toe Trainer
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Challenge your mind with the classic strategy game
            </p>
          </div>
          
          <GameBoard />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
