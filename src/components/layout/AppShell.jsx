import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import './shell.css';

export function AppShell() {
  return (
    <div className="shell">
      <div className="shell__content scrollable" style={{ 
          flex: 1, 
          overflowY: 'auto', // Skroll faqat shu div ichida aylanadi
          WebkitOverflowScrolling: 'touch' // iOS silliq skroll effekti
        }}>
        <Outlet />
      </div>
      <NavBar />
    </div>
  );
}

export function PlainShell() {
  return (
    <div className="shell shell--plain">
      <div className="shell__content shell__content--full scrollable" style={{ 
          flex: 1, 
          overflowY: 'auto', // Skroll faqat shu div ichida aylanadi
          WebkitOverflowScrolling: 'touch' // iOS silliq skroll effekti
        }}>
        <Outlet />
      </div>
    </div>
  );
}
