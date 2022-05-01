import { useEffect } from 'react'
import type { FC, KeyboardEvent } from 'react'
import { supabase, useObjectState } from 'services'
import dayjs from 'dayjs'

export interface Props {}
interface State {
  content: string
  isLoggedIn: boolean
  password: string
  list: ILog[]
}

const App: FC<Props> = () => {
  const [{ content, isLoggedIn, password, list }, setState, onChange] =
    useObjectState<State>({
      content: '',
      isLoggedIn: false,
      password: '',
      list: []
    })

  const onLogin = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && process.env.REACT_APP_PASSWORD === password) {
      setState({ isLoggedIn: true })
    }
  }

  const onCreate = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !isLoggedIn) return
    if (!window.confirm('작성하시겠습니까?')) return

    const { data, error } = await supabase
      .from<ILog>('logs')
      .insert([{ content }])
      .single()
    if (error) {
      console.error(error)
      return
    }
    setState({ content: '', list: [...list, data] })
  }

  const get = async () => {
    const { data, error } = await supabase.from<ILog>('logs').select('*')
    if (error) {
      console.error(error)
      return
    }
    setState({ list: data })
  }

  useEffect(() => {
    get()
  }, [])
  return (
    <div className="container mx-auto max-w-4xl px-6 pt-10">
      <div className="flex items-center justify-between">
        <img src="/kidow-log.svg" alt="" className="h-7" />
        {!isLoggedIn && (
          <input
            value={password}
            name="password"
            onChange={onChange}
            type="password"
            autoFocus
            className="border-b bg-transparent"
            onKeyDown={onLogin}
            spellCheck={false}
          />
        )}
      </div>

      <div className="mt-5 pb-20">
        <input
          value={content}
          name="content"
          onChange={onChange}
          className="w-full rounded-full border border-neutral-600 bg-transparent py-2 px-4"
          onKeyDown={onCreate}
          spellCheck={false}
        />

        <div className="mt-5 divide-y divide-neutral-600">
          {list.map((item) => (
            <div
              key={item.id}
              className="items-center justify-between p-1 sm:flex"
            >
              <span className="block sm:inline-block">{item.content}</span>
              <span className="text-xs text-neutral-600">
                {dayjs(item.created_at).format(
                  'YYYY년 MM월 DD일 HH시 mm분 ss초'
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
