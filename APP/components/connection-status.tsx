'use client';

import { useState, useEffect } from 'react';
import { checkAPIHealth } from '../lib/api';

export default function ConnectionStatus() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                setIsChecking(true);
                const health = await checkAPIHealth();
                setIsConnected(health);
            } catch (error) {
                setIsConnected(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkConnection();
        // Verificar cada 30 segundos
        const interval = setInterval(checkConnection, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isChecking && isConnected === null) {
        return (
            <div className="fixed top-4 right-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        Verificando conexión...
                    </span>
                </div>
            </div>
        );
    }

    if (isConnected === false) {
        return (
            <div className="fixed top-4 right-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 shadow-lg max-w-sm">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                            API No Disponible
                        </h4>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Asegúrate de que la API esté ejecutándose en el puerto 8000:
                        </p>
                        <code className="text-xs bg-red-200 dark:bg-red-800 px-2 py-1 rounded mt-1 block">
                            uvicorn main:app --reload
                        </code>
                    </div>
                </div>
            </div>
        );
    }

    if (isConnected === true) {
        return (
            <div className="fixed top-4 right-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-800 dark:text-green-200">
                        API Conectada
                    </span>
                </div>
            </div>
        );
    }

    return null;
}