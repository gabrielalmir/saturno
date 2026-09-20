import { MarketingPage } from '@/components/landing/MarketingPage';

export default function Contato() {
    return (
        <MarketingPage title="Contato">
            <p>
                Para vendas e parcerias, envie um email para{' '}
                <a
                    className="text-indigo-300 hover:text-indigo-200"
                    href="mailto:vendas@saturno.app"
                >
                    vendas@saturno.app
                </a>
                .
            </p>
            <p>
                Para suporte, use{' '}
                <a
                    className="text-indigo-300 hover:text-indigo-200"
                    href="mailto:suporte@saturno.app"
                >
                    suporte@saturno.app
                </a>
                .
            </p>
        </MarketingPage>
    );
}

