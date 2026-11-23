import { describe, expect, it, vi } from "vitest";
import { MusicOutput } from "@/lib/musicOutput";

const setup = () => {
  const parameter = { value: 0, cancelAndHoldAtTime: vi.fn(), setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() };
  const gain = { gain: parameter, connect: vi.fn() };
  const source = { connect: vi.fn() };
  const context = { currentTime: 4, destination: {}, createGain: () => gain, createMediaElementSource: vi.fn(() => source), resume: vi.fn(async () => {}), close: vi.fn(async () => {}) };
  // Safari ignores media.volume writes: gain must still receive the requested level.
  const element = { get volume() { return 1; }, set volume(_value: number) {} } as HTMLAudioElement;
  const output = new MusicOutput(context as unknown as AudioContext, [element]);
  return { output, parameter, source, gain, context, element };
};

describe("mobile music output", () => {
  it("routes the track through gain and changes software volume even with read-only media volume", () => {
    const { output, parameter, source, gain, context, element } = setup();
    output.level(0, 0.2);
    expect(context.createMediaElementSource).toHaveBeenCalledWith(element);
    expect(source.connect).toHaveBeenCalledWith(gain);
    expect(gain.connect).toHaveBeenCalledWith(context.destination);
    expect(parameter.setValueAtTime).toHaveBeenCalledWith(0.2, 4);
    expect(element.volume).toBe(1);
  });
  it("cancels the old fade before applying a live adjustment", () => {
    const { output, parameter } = setup();
    output.level(0, 0.55, 0.8);
    output.level(0, 0.1);
    expect(parameter.linearRampToValueAtTime).toHaveBeenCalledWith(0.55, 4.8);
    expect(parameter.cancelAndHoldAtTime).toHaveBeenCalledTimes(2);
    expect(parameter.setValueAtTime).toHaveBeenLastCalledWith(0.1, 4);
  });
  it("clamps volume and can mute independently of the media element", () => {
    const { output, parameter } = setup();
    output.level(0, 2);
    expect(parameter.setValueAtTime).toHaveBeenLastCalledWith(1, 4);
    output.level(0, -1);
    expect(parameter.setValueAtTime).toHaveBeenLastCalledWith(0, 4);
  });
});