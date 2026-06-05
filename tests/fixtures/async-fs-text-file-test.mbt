// SYNTAX TEST "source.moonbit" "async fs text_file_test"
// Source: /Users/baozhiyuan/Workspace/async/src/fs/text_file_test.mbt
// Copyright 2025 International Digital Economy Academy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

///|
async test "text file" {
// <- storage.modifier.moonbit
//    ^^^^ storage.type.moonbit
  @async.with_task_group() <| root => {
    let path = "_build/basic_text_file_test"
    root.add_defer(() => @fs.remove(path))
    @fs.write_file(path, "abcd", create_mode=CreateOrTruncate)
    inspect(@fs.read_file(path).text(), content="abcd")
  }
}
