---
outline: [2,3]
---
# 基础知识

## 类型推断

TypeScript 可以识别 JavaScript 语言，在许多情况下可以推断类型。例如，在创建变量并将其赋值给特定值时， TypeScript 将使用该值作为其类型。

```ts
let num = 1 // num: number
const person = {
  name: 'tryharder',
  age; 18
} // person: { name: string, age: number 
```

## 基本类型
### string
```ts
let str = 'hello world'
let str: string = 'hello world'
```
### number
```ts
let num = 1
let num: number = 1
```
### boolean
```ts
let flag = true
let flag: boolean = false
```
### undefined
```ts
let a: undefined = undefined
```
### null
```ts
let a: null = null
```
## any类型
TypeScript还有一个特殊的类型any，当你不希望某个特定的值导致类型检查错误时，你可以使用它。 
当一个值的类型为any时，你可以访问它的任何属性(反过来也会是any类型)，像函数一样调用它，将它赋值给(或从)任何类型的值，或者几乎任何语法合法的东西
```ts
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```
## Array类型
```ts
let arr1 = [1,2,3]
let arr2: number[] = [1,2,3]
let arr3: array<number> = [1,2,3]
let arr4: string[] = ['hello', 'world']
let arr5: array<string> = ['hello', 'world']
```

## Functions
函数是JavaScript中传递数据的主要方式。TypeScript允许你指定函数的输入和输出值的类型。

### 参数类型注解
声明函数时，可以在每个形参之后添加类型注释，以声明函数接受的形参类型。参数类型注释跟在参数名后面:
```ts
// 参数类型注解
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

### 返回类型注解
还可以添加返回类型注释。返回类型注释出现在参数列表之后:
```ts
function getFavoriteNumber(): number {
  return 26;
}
```
就像变量类型注释一样，你通常 ***不需要*** 返回类型注释，**因为TypeScript会根据函数的返回语句推断函数的返回类型。** 上面例子中的类型注释没有改变任何东西。一些代码库将显式地指定返回类型以用于文档编制，以防止意外更改，或者只是出于个人喜好。

### 匿名函数
匿名函数与函数声明略有不同。当一个函数出现在TypeScript可以确定它将如何被调用的位置时，该函数的参数将自动给定类型。
```ts
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];
 
// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUppercase());
Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
 
// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase());
Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```
尽管参数s没有类型注释，TypeScript还是使用forEach函数的类型，以及推断出的数组类型，来确定参数s将具有的类型。 
这个过程称为上下文类型，因为函数所处的上下文决定了它应该具有什么类型。与推理规则类似，您不需要显式地学习这是如何发生的，但是了解它确实发生了可以帮助您注意到什么时候不需要类型注释。稍后，我们将看到更多关于值所在的上下文如何影响其类型的示例。

## Object类型
除了基本类型之外，您将遇到的最常见类型是对象类型。这指的是任何带有属性的JavaScript值，几乎是所有属性!要定义对象类型，只需列出其属性及其类型。 

例如，这里有一个函数，它接受一个类似点的对象:

```ts
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log(" x value is " + pt.x);
  console.log(" y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

### 可选属性
对象类型还可以指定它们的部分或全部属性是可选的。要做到这一点，添加一个?属性名之后:
```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

## 联合类型

::: info
id: number | string
:::

```ts
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

## 类型别名
我们通过直接在类型注解中编写对象类型和联合类型来使用它们。 这很方便，但是常常会想要多次使用同一个类型，并且通过一个名称引用它。

类型别名 正是如此 - 任意 类型 的一个 名称 。 类型别名的语法是：

```ts
type Point = {
  x: number;
  y: number;
};
 

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```

实际上，不只是对象类型，你可以使用类型别名为任何类型命名。 例如，类型别名可以命名联合类型：

```ts
type ID = number | string;
```

## 接口
接口声明 是命名对象类型的另一种方式：

```ts
interface Point {
  x: number;
  y: number;
}
 
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```

## 接口和类型别名的区别

类型别名和接口非常相似，在大多数情况下你可以在它们之间自由选择。 几乎所有的 interface 功能都可以在 type 中使用，***关键区别在于不能重新开放类型以添加新的属性，而接口始终是可扩展的。***

- interface 扩展接口
```ts
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear() 
bear.name
bear.honey
```

- type 扩展类型

```ts
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: Boolean 
}

const bear = getBear();
bear.name;
bear.honey;
```

- interface 向现有接口添加新字段

```ts
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

- type 类型创建后不能更改
```ts
type Window = {
  title: string
}

type Window = {
  ts: TypeScriptAPI
}

 // Error: Duplicate identifier 'Window'.
```
### 总结
- 类型别名不能参与 **声明合并，但接口可以。**
- 接口只能用于 **声明对象的形状，不能重命名基本类型.**
- 接口名称将 **始终以其原始形式出现** 在错误消息中，但 只有 在按名称使用时才会出现。

在大多数情况下，你可以根据个人喜好进行选择，TypeScript 会告诉你它是否需要其他类型的声明。如果您想要启发式方法，可以使用 **interface** 直到你需要使用 type 中的功能。

## 类型断言 as
有些情况下，typescript不能正确推断出详细的类型，你可以使用as更加准确的声明类型

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// 使用泛型
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

## 文字类型
const声明常量

```ts
const constantString = "Hello World";
```

单独的文字类型声明没有多大意义

```ts
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.
```

但是通过将文字组合成联合，你可以表达一个更有用的概念——例如，只接受特定一组已知值的函数:
```ts
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
//Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

你可以将这些与非文字类型结合起来:

```ts
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```
还有一种文字类型:布尔文字。布尔字面值只有两种类型，正如您可能猜到的那样，它们是true和false类型。布尔类型本身实际上只是联合true | false的别名。


当你用一个对象初始化一个变量时，TypeScript假定该对象的属性以后可能会改变值。
```ts
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

as const后缀的作用类似于const，但适用于类型系统，确保所有属性都被分配文字类型，而不是字符串或数字等更通用的版本。

```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

## 非空断言运算符\(后缀!\)

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## 枚举类型
枚举是TypeScript为数不多的不是JavaScript类型级扩展的特性之一。

枚举允许开发人员定义一组命名常量。使用枚举可以更容易地记录意图，或创建一组不同的案例。TypeScript提供了基于数字和字符串的枚举。

枚举可以使用enum关键字定义。

### 1. 数字枚举

```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```
上面，我们有一个数值枚举，其中Up初始化为1。从那时起，以下所有成员都将自动递增。换句话说，Direction.Up为1，Down为2，Left为3，Right为4。

如果我们愿意，我们可以完全去掉初始化式:

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

这里，Up的值是0,Down的值是1，等等。这种自动递增行为对于我们可能不关心成员值本身，但关心每个值与同一枚举中的其他值不同的情况很有用。