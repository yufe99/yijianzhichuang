import { useAppStore } from '@/stores/appStore';
import HomePage from '@/pages/HomePage';
import ProgressPage from '@/pages/ProgressPage';
import ResultPage from '@/pages/ResultPage';

function App() {
  const { currentPage } = useAppStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">一键智创 AI</h1>
        </div>
      </header>
      
      <main className="px-4 pb-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'progress' && <ProgressPage />}
        {currentPage === 'result' && <ResultPage />}
      </main>
    </div>
  );
}

export default App;
