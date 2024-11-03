'use client';

import { Button, ButtonGroup, Input, Select, SelectItem, Switch } from '@nextui-org/react';

export function SearchOptions({options, setOptions}) {
  const {tolerance, enableTime, sort} = options;
  const {setTolerance, setEnableTime, setSort} = setOptions;

  return <div className='w-full flex gap-4 flex-wrap'>
    <div className='flex gap-4 grow'>
      <Select className='basis-2/3' label='Sorting method' selectedKeys={[sort]} onSelectionChange={value => setSort(value)}>
        <SelectItem key="slowest">Slowest</SelectItem>
        <SelectItem key="fastest">Fastest</SelectItem>
        <SelectItem key="closest">Closest</SelectItem>
      </Select>
      <Input className={'basis-1/3 grow'} label='Tolerance' type='number' value={tolerance} onValueChange={value => setTolerance(value)} />
    </div>  
    <div className='flex flex-col gap-3'>
      <Switch className={'w-1/3'} isSelected={enableTime} onChange={value => setEnableTime(!enableTime)}>
          halftime/doubletime
      </Switch>
      {/* <Switch className={'w-1/3'} isSelected={enableTime} onChange={value => setEnableTime(!enableTime)}>
          increase tempo when queue is empty
      </Switch> */}
    </div>
  </div>
}

export function TempoSelector({value, setValue}) {
  // const [value, setValue] = useState(100);
  return <div className="flex flex-col">
    {/* <Input type="number" value={value} onChange={e=>setValue(Number(e.target.value))}></Input> */}
    <h2 className="text-2xl font-bold text-center">{value} BPM</h2>
    <h3 className="text text-center pb-3">Target tempo</h3>
    <ButtonGroup>
      <Button onClick={() => setValue(prev => prev-1)}>-</Button>
      <Button onClick={() => setValue(prev => prev+1)}>+</Button>
    </ButtonGroup>
  </div>
}