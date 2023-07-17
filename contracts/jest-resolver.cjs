module.exports = (request, options) => {
  return options.defaultResolver(request, {
    ...options,
    packageFilter: (pkg) => {
      const pkgNamesToTarget = new Set([
        'rxjs',
        '@firebase/auth',
        '@firebase/storage',
        '@firebase/functions',
        '@firebase/database',
        '@firebase/auth-compat',
        '@firebase/database-compat',
        '@firebase/app-compat',
        '@firebase/firestore',
        '@firebase/firestore-compat',
        '@firebase/messaging',
        '@firebase/util',
        'firebase',
      ]);

      if (pkgNamesToTarget.has(pkg.name)) {
        // console.log('>>>', pkg.name)
        delete pkg['exports'];
        delete pkg['module'];
      }

      // When importing snarkyjs, we specify the Node ESM import as Jest by default imports the web version
      if (pkg.name === 'snarkyjs') {
        return {
          ...pkg,
          main: pkg.exports.node.import,
        };
      }
      if (pkg.name === 'node-fetch') {
        return { ...pkg, main: pkg.main };
      }
      return {
        ...pkg,
        main: pkg.module || pkg.main,
      };
    },
  });
};
