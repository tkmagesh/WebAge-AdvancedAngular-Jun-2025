
##  Core Building Blocks of NgRx

### 1️. **Store**

* The **Store** is a global container that holds the application state as a single immutable object.
* Think of it as a JavaScript object that represents the entire app state tree.
* Usage:

  * Injected into components or services using `Store<T>`.
  * Example:

    ```typescript
    constructor(private store: Store<AppState>) {}
    ```

---

### 2️ **Actions**

* Actions are plain TypeScript classes or objects that represent an event in your app (e.g. "Load Data", "User Clicked Button").
* They carry **payloads** (optional) of data that describe **what happened** but not how to handle it.
* Usage:

  * Typically declared in a separate file with `createAction`.
  * Example:

    ```typescript
    export const loadUsers = createAction('[User] Load Users');
    export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
    ```

---

### 3️. **Reducers**

* Reducers are pure functions that specify **how the state changes** in response to an action.
* They take the **current state** and an **action** as input, and return a **new state**.
* Usage:

  * Typically defined using `createReducer` and `on`.
  * Example:

    ```typescript
    const userReducer = createReducer(
      initialState,
      on(loadUsersSuccess, (state, { users }) => ({ ...state, users }))
    );
    ```

---

### 4️. **Selectors**

* Selectors are pure functions that **select slices of state** from the store.
* They help decouple your UI from the state shape.
* Usage:

  * Created using `createSelector` or `createFeatureSelector`.
  * Example:

    ```typescript
    const selectUserState = createFeatureSelector<UserState>('user');
    const selectAllUsers = createSelector(selectUserState, (state) => state.users);
    ```

---

### 5️. **Effects** (optional, but very powerful)

* Effects handle **side effects** such as HTTP requests, router navigation, or local storage access.
* They listen to dispatched actions and can dispatch new actions in response.
* Usage:

  * Created using `@Injectable()` and `createEffect`.
  * Example:

    ```typescript
    loadUsers$ = createEffect(() => this.actions$.pipe(
      ofType(loadUsers),
      mergeMap(() => this.userService.getUsers()
        .pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(() => of(loadUsersFailure()))
        )
      )
    ));
    ```

---

##  Summary

| **Concept**   | **Responsibility**       |
| ------------- | ------------------------ |
| **Store**     | Holds application state  |
| **Actions**   | Describe what happened   |
| **Reducers**  | Define how state changes |
| **Selectors** | Read slices of state     |
| **Effects**   | Handle side effects      |

---


##  Effects Example

```typescript
loadUsers$ = createEffect(() => this.actions$.pipe(
  ofType(loadUsers),
  mergeMap(() => this.userService.getUsers()
    .pipe(
      map(users => loadUsersSuccess({ users })),
      catchError(() => of(loadUsersFailure()))
    )
  )
));
```

---

##  Line-by-Line Explanation

### 1️. `loadUsers$ = createEffect(() => ... );`

* **Purpose**: Defines a new effect called `loadUsers$`.
* `createEffect` is a function provided by NgRx that registers this observable in the effects system.
* The `$` is a convention to signify that this is an observable stream.

---

### 2️. `this.actions$.pipe(...)`

* **Purpose**: Listens to the **stream of actions** dispatched in the app.
* `this.actions$` is injected via the constructor and is an `Actions` observable containing **all dispatched actions** in the app.

---

### 3️. `ofType(loadUsers)`

* **Purpose**: Filters the actions stream, letting through only actions of type `loadUsers`.
* `loadUsers` is an action creator defined elsewhere:

  ```typescript
  export const loadUsers = createAction('[User] Load Users');
  ```
* **Example**: Only the dispatched `loadUsers` actions trigger this effect.

---

### 4️. `mergeMap(() => this.userService.getUsers()...)`

* **Purpose**: Handles **side effects** by calling the API using `userService`.
* `mergeMap` subscribes to the inner observable (`getUsers()`).

  * If multiple `loadUsers` actions are dispatched quickly, `mergeMap` **runs them concurrently**.

---

### 5️. `this.userService.getUsers()`

* **Purpose**: Calls a backend service (or mock service) that returns an **observable** of users.
* Example implementation (simplified):

  ```typescript
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  ```

---

### 6️. `.pipe(...)`

* We **pipe** operators onto the result of the `getUsers()` observable.

---

### 7️. `map(users => loadUsersSuccess({ users }))`

* **Purpose**: On successful response, dispatches a **success action** containing the loaded users.
* `loadUsersSuccess` is an action creator defined elsewhere:

  ```typescript
  export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
  ```

---

### 8️. `catchError(() => of(loadUsersFailure()))`

* **Purpose**: Catches errors from the API call and dispatches a **failure action**.
* `loadUsersFailure` is another action creator:

  ```typescript
  export const loadUsersFailure = createAction('[User] Load Users Failure');
  ```
* `of(...)` is used to wrap the failure action in an observable.

---

##  Summary of Data Flow

```
Action: loadUsers
      ⬇️
Effect: listens for loadUsers ➡️ calls userService.getUsers()
      ⬇️
  - on success ➡️ dispatches loadUsersSuccess with users
  - on error ➡️ dispatches loadUsersFailure
```

---

