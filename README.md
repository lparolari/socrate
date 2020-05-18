# Socrate

> Real Time Social Management: keep under control overcrowding in your spaces.
> Try it [http://socrate.nexioapp.com/](http://socrate.nexioapp.com/)

_Socrate_, imaginative acronym of Real Time Social Management, is a simple tool with the aim of helping people
keep tracking of overcrowding, as required from the italian governement after COVID-19 provisions of May 18, 2020.

## 🌟 Features

- **free**, the tool is completely free
- **simple**, it is no more than a counter
- **customizable**, you can set your own alert threshold
- **privacy aware**, your data remains on your computer
- **data takeout**, you can export and save your data as history and you can import back your data whenever you want

## 🚀 Getting Started

- Try it [http://socrate.nexioapp.com/](here), or
- Install it with the following commands

```
git clone git@github.com:lparolari/socrate.git
cd socrate
yarn start
```

## ❓ Usage

The only thing you need to do in order to get maximum efficiency from Socrate is
to properly set the thresholds: this allows the tool to notify you on overcrowding
as your needs.

| Tweakable Parameters | Description                                                       | Default | Required |
| -------------------- | ----------------------------------------------------------------- | ------- | -------- |
| threshold            | The overcrowding threshold. Set it to your maximum space capacity | 20      | yes      |
| warning alert rate   | Rete used for warning alerts                                      | 0.7     | no       |
| danger alert rate    | Rete used for danger alerts                                       | 0.9     | no       |

**Note**: Keep in mind that the tool has not persistent storage for now (it is a work
in progress), so before leaving the page export your data.

## 👤 Author

**Luca Parolari**

- Github: [@lparolari](https://github.com/lparolari)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />
Feel free to check [issues page](https://github.com/lparolari/socrate/issues).
If you have any doubt or suggestion, please open an issue.

## 🦄 Show your support

Give a ⭐️ if this project helped or inspired you!

## 📝 License

Built with ❤️ by [Luca Parolari](https://github.com/lparolari).<br />
This project is [MIT](https://github.com/lparolari/socrate/blob/master/LICENSE) licensed.
