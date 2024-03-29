import { SignInButton} from '@farcaster/auth-kit';

export default function NavBar() {
    return (
        <div className="mx-auto w-full justify-center p-0 border-collapse m-0">
            <div className="mx-auto w-full flex flex-col lg:flex-row lg:items-center lg:justify-between px-8 max-w-7xl lg:px-24 py-6 lg:py-16 text-white uppercase"x-data="{ open: false }">
                <div className="items-center flex justify-between flex-row">
                    <a
                        href="/"
                        title="home"
                        aria-label="Author home"
                        className="items-center gap-3 inline-flex tracking-tight"
                            ><span>Author</span>
                    </a>
                </div>
                <nav className="flex-col items-center flex-grow font-medium hidden lg:flex lg:flex-row gap-3 lg:gap-12 lg:justify-start lg:mt-0 lg:p-0 lg:px-0 md:pb-0 opacity-100 p-4 px-5">
                <a
                    href="/trending"
                    title="link to trending page"
                    aria-label="trending"
                    className="duration-300 hover:text-accent-500 lg:ml-auto"
                >
                    Trending
                </a>
                <a
                    href="/recommend"
                    title="link to recommend page"
                    aria-label="recommend"
                    className="duration-300 hover:text-accent-500"
                >
                    Recommend
                </a>
                <a
                    href="/save"
                    title="link to save page"
                    aria-label="save"
                    className="duration-300 hover:text-accent-500"
                >
                    Save
                </a>
                <div className="duration-300 hover:text-accent-500">
                    <SignInButton/>
                </div>
                </nav>
            </div>
        </div>
    )
}