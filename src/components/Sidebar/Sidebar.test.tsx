import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './'

describe('Sidebar', () => {
  it('renders content when open', async () => {
    const user = userEvent.setup()

    render(
      <Sidebar isOpen={true}>
        <h1>I am content</h1>
        <button>Button</button>
      </Sidebar>
    )

    const content = screen.getByRole('heading', {
      level: 1,
      name: /I am content/i,
    })
    await user.click(screen.getByRole('button', { name: /Button/i }))
    expect(content).toBeInTheDocument()
  })

  it('hides content when closed', () => {
    render(
      <Sidebar isOpen={false}>
        <h1>I am content</h1>
      </Sidebar>
    )

    const content = screen.queryByRole('heading', {
      level: 1,
      name: /I am content/i,
    })
    expect(content).not.toBeInTheDocument()
  })
})
