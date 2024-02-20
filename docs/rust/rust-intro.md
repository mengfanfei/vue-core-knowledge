# 基础知识

## 1. 变量与可变性

- 声明变量使用`let`关键字
- 默认情况下，变量事不可变的(immutable)

```rust
fn main() {
  let x = 5;
  println!("The value of x is {}", x);

  x = 6; // error: cannot assign twice to immutable variable
  println!("The value of x is {}", x);
}

--------------------------------------

fn main() {
  let mut x = 5;
  println!("The value of x is {}", x);

  x = 6; // 正确
  println!("The value of x is {}", x);
}
```

- 声明变量时，在变量前面加上`mut`, 就可以使变量可变

## 2. 变量与常量

- 常量（constant），常量在绑定值以后也是不可变的，但是它与不可变的变量有很多区别：

    - 不可以使用`mut`, 常量永远都是不可变的
    - 声明常量使用`const`关键字，它的类型必须被标注
    - 常量可以在任何作用域内进行声明，包括全局作用域
    - 常量只可以绑定到常量表达式，无法绑定到函数的调用结果或只能在运行时才能计算出的值
- 在程序运行期间，常量在其声明的作用域内一直有效
- 命名规范：Rust里常量使用全大写字母，每个单词之间用下划线分开，例如：`MAX_POINTS`
- 例子： `const MAX_POINTS: u32 = 100_000;`(在数字的字面值里可以增加下划线，增加可读性)

## 3. Shadowing（隐藏）
- 可以使用相同的名字声明新的变量，新的变量就会shadow（隐藏）之前声明的同名变量
  - 在后续的代码中这个变量名代表的就是新的变量

```rust
fn main() {
  let x = 5;
  x = x + 1; // 错误
  println!("The value of x is {}", x);
}

----------------------

fn main() {
  let x = 5;
  let x = x + 1; // 正确，shadowing
  let x = x * 2;
  println!("The value of x is {}", x); // 12
}
```

- shadow 和把变量标记为`mut`是不一样的：
  - 如果不使用`let`关键字，那么重新给非 `mut`的变量赋值会导致编译时错误
  - 而使用`let`声明的同名新变量，也是不可变的
  - 使用`let`声明的同名新变量，它的类型可以与之前不同

  ```rust
  fn main() {
    let spaces = "     ";  // $str 类型
    let spaces = spaces.len();  // usize 类型
    println!("{}", spaces);
  }

  ----------

  fn main() {
    let mut spaces = "     ";  // &str l类型
    spaces = spaces.len();  // error: mismatched types -- expected `&str`, found `usize`
    println!("{}", spaces);
  }
  ```

  ## 4. 数据类型

  - **标量**和**复合类型**

  - Rust是静态编译语言，在编译时必须知道所有变量的类型
    - 基于使用的值，编译器通常能够推断出它的具体类型
    - 但如果可能的类型比较多（例如把String转成整数的parse方法），就必须添加类型的标注，否则编译会报错

    ```rust
    fn main() {
      let guess: u32 = "42".parse().expect("Not a number");
      println!("{}", guess);
    }
    ```
   
### 4.1 标量类型

- 一个标量类型代表一个单个的值
- Rust有四个主要的标量类型：
  1. 整数类型
  2. 