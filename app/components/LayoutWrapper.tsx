import { Link } from '@remix-run/react'
import { ReactNode } from 'react'
import SectionContainer from './SectionContainer'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className="flex flex-col justify-between h-screen">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link to="/" aria-label="dov.dev">
              <div className="flex items-center justify-between">
                <div className="dark:logo-dark mr-3">
                  {/* <Logo /> */}
                </div>
                <div className="hidden h-6 text-2xl font-semibold sm:block">
                  mc register
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
            </div>
          </div>
        </header>
        <main className="mb-auto h-full">{children}</main>
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
