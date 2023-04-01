import chalk from 'chalk';
export const Logger = {
    info(message) {
        console.log(chalk.green(new Date().toLocaleString() + ': ' + message + '\n'));
    },
    warning(message) {
        console.log(chalk.yellow(`${new Date().toLocaleString()}: ${message}\n`));
    },
    error(message) {
        console.log(chalk.red(`${new Date().toLocaleString()}: ${message}\n`));
    }
};
//# sourceMappingURL=Logger.js.map