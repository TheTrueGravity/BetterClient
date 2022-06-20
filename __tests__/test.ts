import {
    hello
} from '../src/index'

test('Hello', () => {
    expect(hello()).toBe('Hello, world!');
})