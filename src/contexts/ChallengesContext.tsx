import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from './../../challenges.json'
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LeveUpModal';

interface Challenge {
    type: `body` | `eye`,
    description: string,
    amount: number
}

interface ChallengesContextData {
    level: number,
    currentExperience: number,
    challengesCompleted: number,
    activeChallenge: Challenge,
    experienceToNextLevel: number,
    levelUp: () => void,
    resetChallenge: () => void,
    startNewChallenge: () => void,
    completeChallenge: () => void,
    closeLevelUpModal: () => void,
}

interface ChalllengesProviderProps {
    children: ReactNode,
    level: number,
    currentExperience: number,
    challengesCompleted: number,
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChalllengesProvider({ children, ...props }: ChalllengesProviderProps) {
    const [level, setLevel] = useState(props.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(props.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(props.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo Desafio', {
                body: `Valendo ${challenge.amount}xp`
            });
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return
        } else {
            const { amount } = activeChallenge;
            let finalExperience = currentExperience + amount;
            if (finalExperience >= experienceToNextLevel) {
                finalExperience -= experienceToNextLevel;
                levelUp();
            }
            setCurrentExperience(finalExperience);
            setActiveChallenge(null);
            setChallengesCompleted(challengesCompleted + 1)
        }
    }

    return (
        <ChallengesContext.Provider value={{
            level,
            currentExperience,
            challengesCompleted,
            experienceToNextLevel,
            activeChallenge,
            levelUp,
            startNewChallenge,
            resetChallenge,
            completeChallenge,
            closeLevelUpModal
        }}>
            {children}
            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}