import { StyleTile } from "./style-tile";

type StyleOption = {
  id: string;
  name: string;
};

type StyleSwitcherProps = {
  styles: StyleOption[];
};

export function StyleSwitcher({ styles }: StyleSwitcherProps) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">Select a style</p>
      <div role="radiogroup" aria-label="Style" className="flex gap-3">
        {styles.map((style, index) => (
          <StyleTile
            key={style.id}
            name={style.name}
            imageSrc="/examples/example_01.png"
            selected={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
