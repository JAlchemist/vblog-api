<!DOCTYPE html>
<html lang="en">
<<head>
    <meta charset="UTF-8"/>
    <title>Home</title>
</head>
<body>
<span th:text="${name}"></span>
<ul>
    <li th:each="item : ${list}" th:text="${item}"></li>
</ul>
</body>
</html>