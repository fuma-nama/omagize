import StyledSelect from "../fields/StyledSelect";

export type TimeValue = {
    hours: number, minutes: number
}

function parseMinute(minute: number): TimeValue {
    const hours = (minute / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return {
        hours: rhours,
        minutes: rminutes
    }
}

export function TimePicker({unit = 15, ...props}: { unit?: number, value?: TimeValue, onChange?: (value: TimeValue) => void }) {
    const maxMinute = 24 * 60
    const choices: TimeValue[] = []

    for (let i = 0; i < maxMinute; i += unit) {
        choices.push(parseMinute(i))
    }

    if (!!props.value && props.value.minutes % unit !== 0) {
        choices.push(props.value)
    }

    const options = choices.map(o => ({
        label: `${o.hours.toString().padStart(2, '0')}:${o.minutes.toString().padStart(2, '0')}`,
        value: o
    }))

    return <StyledSelect
        placeholder='00:00'
        options={options}
        value={!!props.value && options.find(o => equals(o.value, props.value))}
        onChange={e => {
            !!props.onChange && props.onChange(e.value)
        }}
    />
}

function equals(o: TimeValue, other: TimeValue) {
    return o.hours == other.hours && o.minutes == other.minutes
}